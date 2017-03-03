// LICENSE : MIT
"use strict";
const path = require("path");
const assert = require("power-assert");
import {TextLintEngine} from "../../src/index";
import TextLintCore from "../../src/textlint-core";
import {setExperimental} from "../../src/util/throw-log";
// fixture
import fixtureRule from "./fixtures/rules/example-rule";
import fixtureRuleAsync from "./fixtures/rules/async-rule";
describe("Async", function () {
    beforeEach(function () {
        setExperimental(true);
    });
    it("should support async", function () {
        var textlint = new TextLintCore();
        textlint.setupRules({
            "rule-name": function (context) {
                const {Syntax, report, RuleError} = context;

                return {
                    [Syntax.Str](node){
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                report(node, new RuleError("before"));
                                resolve();
                            }, 100);
                        });
                    },
                    [Syntax.Str + ":exit"](node){
                        report(node, new RuleError("after"));
                    }
                };
            }
        });
        return textlint.lintMarkdown("string").then(result => {
            assert(result.filePath === "<markdown>");
            assert(result.messages.length === 2);
        });
    });
    it("should promise each messages", function () {
        var textlint = new TextLintCore();
        // each rule throw 1 error.
        textlint.setupRules({
            "example-rule": fixtureRule,
            "async-rule": fixtureRuleAsync,
            "example2-rule": fixtureRule,
            "example3-rule": fixtureRule,
            "async2-rule": fixtureRuleAsync
        });
        return textlint.lintMarkdown("string").then(result => {
            // filtered duplicated messages => 2 patterns
            assert(result.messages.length === 2);
        });
    });
    it("should promise each messages on multiple files", function () {
        const rules = ["async-rule", "example-rule"];
        var engine = new TextLintEngine({
            rulesBaseDirectory: path.join(__dirname, "fixtures", "rules"),
            rules: rules
        });
        var targetFile1 = path.join(__dirname, "fixtures", "test.md");
        var targetFile2 = path.join(__dirname, "fixtures", "test2.md");
        const files = [targetFile1, targetFile2];
        return engine.executeOnFiles(files).then(results => {
            assert.equal(results.length, files.length);
            results.forEach(result => {
                assert.equal(result.messages.length, rules.length);
            });
        });
    });
});
