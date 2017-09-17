// LICENSE : MIT
"use strict";
import { ASTNodeTypes } from "@textlint/ast-node-types";
import RuleContext from "./rule-context";
import { TextLintRuleOptions, TxtNode } from "../textlint-kernel-interface";
import FilterRuleContext from "./filter-rule-context";
/**
 * Reporter function
 *
 * FIXME: Separate RuleCreatorReporter to FilterRuleCreatorReporter
 */
export type RuleCreatorReporter = (
    context: RuleContext | FilterRuleContext,
    options?: TextLintRuleOptions | boolean
) => { [P in keyof typeof ASTNodeTypes]: (node: TxtNode) => void | Promise<any> };
export type RuleFixableCreator = { linter: RuleCreatorReporter; fixer: RuleCreatorReporter };
export type RuleCreator = RuleCreatorReporter | RuleFixableCreator;

/**
 * detect that ruleCreator has linter function
 * @param {*} ruleCreator
 * @returns {boolean}
 */
export function hasLinter(ruleCreator: RuleCreator): boolean {
    if (typeof ruleCreator === "object" && typeof ruleCreator.linter === "function") {
        return true;
    }
    return typeof ruleCreator === "function";
}

/**
 * get linter function from ruleCreator
 * if not found, throw error
 * @param {Function|Object} ruleCreator
 * @returns {Function} linter function
 * @throws
 */
export function getLinter(ruleCreator: RuleCreator): RuleCreatorReporter {
    if (typeof ruleCreator === "object" && typeof ruleCreator.linter === "function") {
        return ruleCreator.linter;
    }
    if (typeof ruleCreator === "function") {
        return ruleCreator;
    }
    throw new Error("Not found linter function in the ruleCreator");
}

/**
 * detect that ruleCreator has fixer function
 * @param {*} ruleCreator
 * @returns {boolean}
 */
export function hasFixer(ruleCreator: RuleCreator): ruleCreator is RuleFixableCreator {
    return typeof ruleCreator === "object" && typeof ruleCreator.fixer === "function" && hasLinter(ruleCreator);
}

/**
 * get fixer function from ruleCreator
 * if not found, throw error
 * @param {Function|Object} ruleCreator
 * @returns {Function} fixer function
 * @throws
 */
export function getFixer(ruleCreator: RuleCreator) {
    if (!hasLinter(ruleCreator)) {
        throw new Error("fixer module should have also linter function.");
    }

    if (hasFixer(ruleCreator)) {
        return ruleCreator.fixer;
    }
    throw new Error("Not found fixer function in the ruleCreator");
}

/**
 * RuleModule should has either linter or fixer.
 * @param ruleCreator
 * @returns {boolean}
 **/
export function isRuleModule(ruleCreator: RuleCreator): boolean {
    return hasLinter(ruleCreator) || hasFixer(ruleCreator);
}

/**
 * Validate rule module.
 * if invalid throw error
 * @param {*} ruleModule
 * @param {string} key
 * @throws
 */
export function assertRuleShape(ruleModule: any, key = "") {
    if (ruleModule === undefined) {
        throw new Error(`Definition of rule '${key}' was not found.`);
    }
    /*
    Check old rule function
    module.exports = function(context){

    }
    */
    if (!isRuleModule(ruleModule)) {
        throw new Error(`Definition of rule '${key}' was not rule module.
Rule should export function:
module.exports = function(context){
    // Your rule
};`);
    }
}

/**
 * get linter function from ruleCreator
 * if not found, throw error
 * @param {*} ruleCreator
 * @returns {Function} linter function
 * @throws
 */
export function getFilter(ruleCreator: RuleCreator) {
    if (typeof ruleCreator === "function") {
        return ruleCreator;
    }
    throw new Error("Not found filter function in the ruleCreator");
}
