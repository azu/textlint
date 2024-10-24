// LICENSE : MIT
"use strict";
import type { TextlintResult } from "@textlint/types";

import { moduleInterop } from "@textlint/module-interop";

import fs from "fs";
import path from "path";
import { dynamicImport, tryResolve } from "@textlint/resolver";
import debug0 from "debug";
// formatter
import checkstyleFormatter from "./formatters/checkstyle";
import compactFormatter from "./formatters/compact";
import jslintXMLFormatter from "./formatters/jslint-xml";
import jsonFormatter from "./formatters/json";
import junitFormatter from "./formatters/junit";
import prettyErrorFormatter from "./formatters/pretty-error";
import stylishFormatter from "./formatters/stylish";
import tableFormatter from "./formatters/table";
import tapFormatter from "./formatters/tap";
import unixFormatter from "./formatters/unix";

const builtinFormatterList = {
    checkstyle: checkstyleFormatter,
    compact: compactFormatter,
    "jslint-xml": jslintXMLFormatter,
    json: jsonFormatter,
    junit: junitFormatter,
    "pretty-error": prettyErrorFormatter,
    stylish: stylishFormatter,
    table: tableFormatter,
    tap: tapFormatter,
    unix: unixFormatter
} as const;
type BuiltInFormatterName = keyof typeof builtinFormatterList;
const builtinFormatterNames = Object.keys(builtinFormatterList);
const debug = debug0("textlint:@textlint/linter-formatter");

export interface FormatterConfig {
    formatterName: string;
    color?: boolean;
}

export async function loadFormatter(formatterConfig: FormatterConfig) {
    const formatterName = formatterConfig.formatterName;
    debug(`formatterName: ${formatterName}`);
    if (builtinFormatterNames.includes(formatterName)) {
        return {
            format(results: TextlintResult[]) {
                return builtinFormatterList[formatterName as BuiltInFormatterName](results, formatterConfig);
            }
        };
    }
    let formatter: (results: TextlintResult[], formatterConfig: FormatterConfig) => string;
    let formatterPath;
    if (fs.existsSync(formatterName)) {
        formatterPath = formatterName;
    } else if (fs.existsSync(path.resolve(process.cwd(), formatterName))) {
        formatterPath = path.resolve(process.cwd(), formatterName);
    } else {
        const pkgPath =
            tryResolve(`textlint-formatter-${formatterName}`, {
                parentModule: "linter-formatter"
            }) ||
            tryResolve(formatterName, {
                parentModule: "linter-formatter"
            });
        if (pkgPath) {
            formatterPath = pkgPath;
        }
    }

    if (!formatterPath) {
        throw new Error(`Could not find formatter ${formatterName}`);
    }
    try {
        const mod = moduleInterop(
            (
                await dynamicImport(formatterPath, {
                    parentModule: "linter-formatter"
                })
            ).exports
        );
        if (typeof mod !== "function") {
            throw new Error(`formatter should export function, but ${formatterPath} exports ${typeof mod}`);
        }
        formatter = mod;
    } catch (ex) {
        throw new Error(`Could not find formatter ${formatterName}
${ex}`);
    }
    return {
        format(results: TextlintResult[]) {
            return formatter(results, formatterConfig);
        }
    };
}

/**
 * @deprecated use loadFormatter
 * @param formatterConfig
 */
export function createFormatter(formatterConfig: FormatterConfig) {
    const formatterName = formatterConfig.formatterName;
    debug(`formatterName: ${formatterName}`);
    if (builtinFormatterNames.includes(formatterName)) {
        return function (results: TextlintResult[]) {
            return builtinFormatterList[formatterName as BuiltInFormatterName](results, formatterConfig);
        };
    }
    let formatter: (results: TextlintResult[], formatterConfig: FormatterConfig) => string;
    let formatterPath;
    if (fs.existsSync(formatterName)) {
        formatterPath = formatterName;
    } else if (fs.existsSync(path.resolve(process.cwd(), formatterName))) {
        formatterPath = path.resolve(process.cwd(), formatterName);
    } else {
        const pkgPath =
            tryResolve(`textlint-formatter-${formatterName}`, {
                parentModule: "linter-formatter"
            }) ||
            tryResolve(formatterName, {
                parentModule: "linter-formatter"
            });
        if (pkgPath) {
            formatterPath = pkgPath;
        }
    }

    if (!formatterPath) {
        throw new Error(`Could not find formatter ${formatterName}`);
    }
    try {
        formatter = moduleInterop(require(formatterPath));
    } catch (ex) {
        throw new Error(`Could not find formatter ${formatterName}
${ex}`);
    }
    return function (results: TextlintResult[]) {
        return formatter(results, formatterConfig);
    };
}

export interface FormatterDetail {
    name: string;
}

export function getFormatterList(): FormatterDetail[] {
    return builtinFormatterNames.map((name) => {
        return {
            name
        };
    });
}
