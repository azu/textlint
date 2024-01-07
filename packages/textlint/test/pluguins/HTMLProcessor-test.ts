// LICENSE : MIT
"use strict";
import * as assert from "assert";
import { TextLintCore } from "../../src/index";
import * as path from "path";
import exampleRule from "./fixtures/example-rule";
// @ts-ignore
import htmlPlugin from "textlint-plugin-html";

/**
 * @deprecated
 * old HTMLPlugin tests
 */
describe("@DEPRECATED: HTMLPlugin", function () {
    let textlintCore: TextLintCore;
    context("when target file is a HTML", function () {
        beforeEach(function () {
            textlintCore = new TextLintCore();
            textlintCore.setupPlugins({ html: htmlPlugin });
            textlintCore.setupRules({ "example-rule": exampleRule });
        });
        it("should have default + additional processors", function () {
            const descriptors = textlintCore.textlintKernelDescriptor.plugin.descriptors;
            assert.strictEqual(descriptors.length, 3);
        });
        it("should ignore duplicated processor", function () {
            textlintCore.setupPlugins({ html: htmlPlugin });
            textlintCore.setupPlugins({ html: htmlPlugin });
            const descriptors = textlintCore.textlintKernelDescriptor.plugin.descriptors;
            assert.strictEqual(descriptors.length, 3);
        });
        it("should report error", function () {
            const fixturePath = path.join(__dirname, "./fixtures/test.html");
            return textlintCore.lintFile(fixturePath).then((results) => {
                assert.ok(results.messages.length > 0);
                assert.ok(results.filePath === fixturePath);
            });
        });
    });
});
