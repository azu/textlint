import { TxtNode } from "@textlint/ast-node-types";
import { TextlintSourceCodeRange } from "../Source/TextlintSourceCode";
import { TextlintRuleContextFixCommand } from "./TextlintRuleContextFixCommand";

/**
 * Creates code fixing commands for rules.
 * It create command for fixing texts.
 * The `range` arguments of these command is should be **relative** value from reported node.
 * See {@link SourceLocation} class for more detail.
 * @constructor
 */
export abstract class TextlintRuleContextFixCommandGenerator {
    /**
     * Creates a fix command that inserts text after the given node or token.
     * The fix is not applied until applyFixes() is called.
     * @param {TxtNode} node The node or token to insert after.
     * @param {string} text The text to insert.
     * @returns {IntermediateFixCommand} The fix command.
     */
    abstract insertTextAfter(node: TxtNode, text: string): TextlintRuleContextFixCommand;

    /**
     * Creates a fix command that inserts text after the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {number[]} range The range to replace, first item is start of range, second
     *      is end of range.
     *      The `range` should be **relative** value from reported node.
     * @param {string} text The text to insert.
     * @returns {IntermediateFixCommand} The fix command.
     */
    abstract insertTextAfterRange(range: TextlintSourceCodeRange, text: string): TextlintRuleContextFixCommand;

    /**
     * Creates a fix command that inserts text before the given node or token.
     * The fix is not applied until applyFixes() is called.
     * @param {TxtNode} node The node or token to insert before.
     * @param {string} text The text to insert.
     * @returns {IntermediateFixCommand} The fix command.
     */
    abstract insertTextBefore(node: TxtNode, text: string): TextlintRuleContextFixCommand;

    /**
     * Creates a fix command that inserts text before the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {number[]} range The range to replace, first item is start of range, second
     *      is end of range.
     *      The `range` should be **relative** value from reported node.
     * @param {string} text The text to insert.
     * @returns {IntermediateFixCommand} The fix command.
     */
    abstract insertTextBeforeRange(range: TextlintSourceCodeRange, text: string): TextlintRuleContextFixCommand;

    /**
     * Creates a fix command that replaces text at the node or token.
     * The fix is not applied until applyFixes() is called.
     * @param {TxtNode} node The node or token to remove.
     * @param {string} text The text to insert.
     * @returns {IntermediateFixCommand} The fix command.
     */
    abstract replaceText(node: TxtNode, text: string): TextlintRuleContextFixCommand;

    /**
     * Creates a fix command that replaces text at the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {number[]} range The range to replace, first item is start of range, second
     *      is end of range.
     *      The `range` should be **relative** value from reported node.
     * @param {string} text The text to insert.
     * @returns {IntermediateFixCommand} The fix command.
     */
    abstract replaceTextRange(range: TextlintSourceCodeRange, text: string): TextlintRuleContextFixCommand;

    /**
     * Creates a fix command that removes the node or token from the source.
     * The fix is not applied until applyFixes() is called.
     * @param {TxtNode} node The node or token to remove.
     * @returns {IntermediateFixCommand} The fix command.
     */
    abstract remove(node: TxtNode): TextlintRuleContextFixCommand;

    /**
     * Creates a fix command that removes the specified range of text from the source.
     * The fix is not applied until applyFixes() is called.
     * @param {number[]} range The range to remove, first item is start of range, second
     *      is end of range.
     *      The `range` should be **relative** value from reported node.
     * @returns {IntermediateFixCommand} The fix command.
     */
    abstract removeRange(range: TextlintSourceCodeRange): TextlintRuleContextFixCommand;
}
