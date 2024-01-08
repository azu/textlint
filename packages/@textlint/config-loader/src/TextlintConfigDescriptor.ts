// Probably same with TextlintKernelOptions
// TODO: @textlint/config-loader should be independent from @textlint/kernel
import type { TextlintKernelFilterRule, TextlintKernelPlugin, TextlintKernelRule } from "@textlint/kernel";
import type { TextlintRuleModule, TextlintRuleOptions } from "@textlint/types";

export type TextlintConfigPlugin = TextlintKernelPlugin & {
    filePath: string;
    /**
     * plugin module name
     */
    moduleName: string;
};
//  a rule module
export type TextlintConfigSingleRule = TextlintKernelRule & {
    type: "Rule";
    filePath: string;
    /**
     * rule module name
     * @example "textlint-rule-example"
     */
    moduleName: string;
};
// a rule in preset module
export type TextlintConfigRuleInPreset = TextlintKernelRule & {
    type: "RuleInPreset";
    filePath: string;
    /**
     * preset module name
     * @example "textlint-rule-preset-example"
     */
    moduleName: string;
    /**
     * rule key in preset
     * @example "{preset-name}/{rule-key}"
     */
    ruleKey: string;
};
export type TextlintConfigRule = TextlintConfigSingleRule | TextlintConfigRuleInPreset;
export type TextlintConfigFilterRule = TextlintKernelFilterRule & { filePath: string; moduleName: string };
export type TextlintConfigRulePreset = {
    id: string;
    preset: {
        rules: {
            [index: string]: TextlintRuleModule;
        };
        rulesConfig: {
            [index: string]: TextlintRuleOptions | boolean;
        };
    };
    filePath: string;
    moduleName: string;
};
export type TextlintConfigDescriptor = {
    // plugins
    plugins: TextlintConfigPlugin[];
    // rules
    // preset's rules is included in this
    rules: TextlintConfigRule[];
    // filterRules
    filterRules: TextlintConfigFilterRule[];
};
