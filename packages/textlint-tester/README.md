# textlint-tester

[Mocha](http://mochajs.org/ "Mocha") test helper library for [textlint](https://github.com/textlint/textlint "textlint") rule.

## Installation

    npm install --save-dev textlint-tester mocha

## Usage

1. Write tests by using `textlint-tester`
2. Run tests by [Mocha](http://mochajs.org/ "Mocha")

### TextLintTester

#### TextLintTester#run(ruleName, rule, {valid=[], invalid=[]})

##### valid object

- `{string} ruleName` ruleName is a name of the rule.
- `{Function} rule` rule is the exported function of the rule.
- `{string[]|object[]} valid` valid is an array of text which should be passed.
    - You can use `object` if you want to specify some options. `object` can have the following properties:
        - `{string} text`: a text to be linted
        - `{string} ext`: an extension key. Default: `.md` (Markdown)
        - `{string} inputPath`: a test text filePath that prefer to `text` property
        - `{object} options`: options to be passed to the rule

`valid` object example:

```js
[
    "text",
    { text : "text" },
    {
        text: "text",
        options: {
            "key": "value",
        },
    },
    {
        text: "<p>this sentence is parsed as HTML document.</p>",
        ext: ".html",
    },
]
```


##### invalid object

- `{object[]} invalid` invalid is an array of object which should be failed.
    - `object` can have the following properties:
        - `{string} text`: a text to be linted.
        - `{string} inputPath`: a test text filePath that prefer to `text` property.
        - `{string} output`: a fixed text.
        - `{string} ext`: an extension key.
        - `{object[]} errors`: an array of error objects which should be raised againt the text.

`invalid` object example:

```js
[
    {
        text: "text",
        output: "text",
        ext: ".txt",
        errors: [
            {
                messages: "expected message",
                line: 1,
                column: 1
            }
        ]
    }
]
```

### Example

`test/example-test.js`:

```js
const TextLintTester = require("textlint-tester");
const tester = new TextLintTester();
// rule
const rule = require("textlint-rule-no-todo");
// ruleName, rule, { valid, invalid }
tester.run("no-todo", rule, {
    valid: [
        "This is ok",
        {
            // text with options
            text: "This is test",
            options: {
                "key": "value"
            }
        }
    ],
    invalid: [
        // line, column
        {
            text: "- [ ] string",
            errors: [
                {
                    message: "Found TODO: '- [ ] string'",
                    line: 1,
                    column: 3
                }
            ]
        },
        // index
        {
            text: "- [ ] string",
            errors: [
                {
                    message: "Found TODO: '- [ ] string'",
                    index: 2
                }
            ]
        },
        {
            text: "TODO: string",
            options: {"key": "value"},
            errors: [
                {
                    message: "found TODO: 'TODO: string'",
                    line: 1,
                    column: 1
                }
            ]
        },
        {
         text: "TODO: string",
         output: "string", // <= fixed output
         errors: [
             {
                 message: "found TODO: 'TODO: string'",
                 line: 1,
                 column: 1
             }
         ]
        }
    ]
});
```

Run the tests:

```sh
$(npm bin)/mocha test/
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
