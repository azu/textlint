// LICENSE : MIT
import { createLinter, loadTextlintrc, loadLinterFormatter } from "textlint";
import path from "node:path";

async function lintFile(filePath: string) {
    // descriptor is a structure object for linter
    // It includes rules, plugins, and options
    const descriptor = await loadTextlintrc({
        configFilePath: path.join(process.cwd(), ".textlintrc.json")
    });
    const linter = createLinter({
        descriptor
    });
    const results = await linter.lintFiles([filePath]);
    // textlint has two types formatter sets for linter and fixer
    const formatter = await loadLinterFormatter({ formatterName: "stylish" });
    const output = formatter.format(results);
    console.log(output);
}

lintFile(path.join(process.cwd(), "fixtures/success.md")).catch(function (error) {
    console.error(error);
    process.exit(1);
});
