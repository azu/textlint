// LICENSE : MIT
"use strict";
import { SyntaxMap } from "./mapping/markdown-syntax-map";
import { TxtNode } from "@textlint/ast-node-types";
import traverse from "traverse";
import StructuredSource from "structured-source";
const { ASTNodeTypes } = require("@textlint/ast-node-types");

const debug = require("debug")("@textlint/markdown-to-ast");
const unified = require("unified");
const remarkParse = require("remark-parse");
const frontmatter = require("remark-frontmatter");
const remark = unified().use(remarkParse).use(frontmatter, ["yaml"]);

export { ASTNodeTypes as Syntax };

/**
 * parse markdown text and return ast mapped location info.
 * @param {string} text
 * @returns {TxtNode}
 */
export function parse<T extends TxtNode>(text: string): T {
    const ast = remark.parse(text);
    const src = new StructuredSource(text);
    traverse(ast).forEach(function (node: TxtNode) {
        // eslint-disable-next-line no-invalid-this
        if (this.notLeaf) {
            if (node.type) {
                const replacedType = SyntaxMap[node.type as keyof typeof SyntaxMap];
                if (!replacedType) {
                    debug(`replacedType : ${replacedType} , node.type: ${node.type}`);
                } else {
                    node.type = replacedType;
                }
            }
            // map `range`, `loc` and `raw` to node
            if (node.position) {
                const position = node.position;
                const positionCompensated = {
                    start: { line: position.start.line, column: Math.max(position.start.column - 1, 0) },
                    end: { line: position.end.line, column: Math.max(position.end.column - 1, 0) }
                };
                const range = src.locationToRange(positionCompensated);
                node.loc = positionCompensated;
                node.range = range;
                node.raw = text.slice(range[0], range[1]);
                // Compatible for https://github.com/wooorm/unist, but hidden
                Object.defineProperty(node, "position", {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: position
                });
            }
        }
    });
    return ast;
}
