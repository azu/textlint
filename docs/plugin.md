# Plugin

Each plugin is an npm module with a name in the format of `textlint-plugin-<plugin-name>`.
For example, `textlint-plugin-english`.

## Create a Plugin

**Deprecated**: Plugin should have `Processor`. Use [preset](./rule-preset.md) insteadof plugin for collecting rules.

- [Drop "rules" and "rulesConfig" in plugin · Issue #291 · textlint/textlint](https://github.com/textlint/textlint/issues/291 "Drop &#34;rules&#34; and &#34;rulesConfig&#34; in plugin · Issue #291 · textlint/textlint")

Plugin is a set of `rules` and `rulesConfig`.

If your plugin has rules, then it must export an object with a rules property.
This rules property should be an object containing a key-value mapping of rule ID to rule.
The rule ID does not have to follow any naming convention (so it can just be `no-todo`, for instance).

```js
export default {
    rules: {
        "no-todo"(context, options) {
            // rule implementation ...
        }
    },
    rulesConfig: {
        "no-todo": true
    }
};
```

## How to create rule?

This is the same way of textlint rule.
 
See [docs/rule.md](./rule.md).

## Default Configuration for Plugins
   
You can provide default configuration for `rules` by `rulesConfig` property.
`rulesConfig` follows the same pattern as you would use in your `.textlintrc` config rules property, but without plugin name as a prefix.
   
```js
export default {
    rules: {
        myFirstRule: require("./lib/rules/my-first-rule"),
        mySecondRule: require("./lib/rules/my-second-rule")
    },
    rulesConfig: {
        myFirstRule: true,
        mySecondRule: {
            key: "value"
        }
    }
};
```

## Processor

Plugin has a `Processor` that is optional.

```js
// index.js
export default {
    Processor: require("./SomeProcessor")
};
```

`Processor` class defined pre/post process of the file and available file types.

textlint already support `.txt` and `.md`. These are implemented by `Processor`

- [textlint/textlint-plugin-markdown](https://github.com/textlint/textlint-plugin-markdown)
- [textlint/textlint-plugin-text](https://github.com/textlint/textlint-plugin-text)
- [textlint/textlint-plugin-html](https://github.com/textlint/textlint-plugin-html)

`Processor` class example code:

```js
// TextProcessor.js
import { parse } from "txt-to-ast";
export default class TextProcessor {
    constructor(options) {
        this.options = options;
    }
    // available ".ext" list
    static availableExtensions() {
        return [".txt", ".text"];
    }
    // define pre/post process
    // in other words, parse and generate process
    processor(ext) {
        return {
            preProcess(text, filePath) {
                // parsed result is a AST object
                // AST is consist of TxtNode
                // https://github.com/textlint/textlint/blob/master/docs/txtnode.md
                return parse(text);
            },
            postProcess(messages, filePath) {
                return {
                    messages,
                    filePath: filePath ? filePath : "<text>"
                };
            }
        };
    }
}
```

You can use Processor plugin in the same way a plugin.

```
{
    "plugins": [
        "<Processor Plugin>"
    ]
}
```

Your Processor plugins's `preProcess` method should return `TxtAST` object.

:information_source: Please see document about `TxtAST` before implementing Processor/Parser.

## Processor options

You can pass a options to your plugin from `.textlintrc`.

```
{
    "plugins": {
        pluginName: processorOption
    }
}
```

You can receive the `processorOption` via constructor arguments.

```js
export default class YourProcessor {
    constructor(options) {
        this.options = options; // <= processorOption!
    }
    // ...
}
```

## Testing

You can test the rules of your plugin the same way as bundled textlint rules using [textlint-tester](https://www.npmjs.com/package/textlint-tester "textlint-tester").

```js
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
const noTodo = require("textlint-rule-no-todo");
// ruleName, rule, expected[]
tester.run("no-todo", noTodo, {
    valid: [
        "string, test desu",
        {
            text: "日本語 is Japanese."
        }
    ],
    invalid: [
        // text, expected errors
        {
            text: "- [ ] string",
            errors: [{ message: "found TODO: '- [ ] string'" }]
        },
        {
            text: "TODO: string",
            errors: [{ message: "found TODO: 'TODO: string'" }]
        }
    ]
});
```

### Example

(limited) XML plugin

- [azu/textlint-plugin-xml-example](https://github.com/azu/textlint-plugin-xml-example "azu/textlint-plugin-xml-example")

----


The plugin system is a inspired/fork of ESLint.

- [Documentation - ESLint - Pluggable JavaScript linter](http://eslint.org/docs/developer-guide/working-with-plugins "Documentation - ESLint - Pluggable JavaScript linter")
