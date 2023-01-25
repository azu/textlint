export enum ASTNodeTypes {
    Document = "Document",
    DocumentExit = "Document:exit",
    Paragraph = "Paragraph",
    ParagraphExit = "Paragraph:exit",
    BlockQuote = "BlockQuote",
    BlockQuoteExit = "BlockQuote:exit",
    ListItem = "ListItem",
    ListItemExit = "ListItem:exit",
    List = "List",
    ListExit = "List:exit",
    Header = "Header",
    HeaderExit = "Header:exit",
    CodeBlock = "CodeBlock",
    CodeBlockExit = "CodeBlock:exit",
    /**
     * @deprecated use Html instead of it
     */
    HtmlBlock = "HtmlBlock",
    HtmlBlockExit = "HtmlBlock:exit",
    HorizontalRule = "HorizontalRule",
    HorizontalRuleExit = "HorizontalRule:exit",
    Comment = "Comment",
    CommentExit = "Comment:exit",
    /**
     * @deprecated
     */
    ReferenceDef = "ReferenceDef",
    /**
     * @deprecated
     */
    ReferenceDefExit = "ReferenceDef:exit",
    // inline
    Str = "Str",
    StrExit = "Str:exit",
    Break = "Break", // well-known Hard Break
    BreakExit = "Break:exit", // well-known Hard Break
    Emphasis = "Emphasis",
    EmphasisExit = "Emphasis:exit",
    Strong = "Strong",
    StrongExit = "Strong:exit",
    Html = "Html",
    HtmlExit = "Html:exit",
    Link = "Link",
    LinkExit = "Link:exit",
    Image = "Image",
    ImageExit = "Image:exit",
    Code = "Code",
    CodeExit = "Code:exit",
    Delete = "Delete",
    DeleteExit = "Delete:exit"
}
