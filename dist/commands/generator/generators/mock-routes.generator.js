"use strict";
const tslib_1 = require("tslib");
const sub_generator_1 = require("../sub-generator");
const includes_1 = require("../../../core/includes");
const tools_1 = require("../../../core/includes/tools");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const glob_1 = tslib_1.__importDefault(require("glob"));
class MockRoutesGeneratorClass extends sub_generator_1.SubGenerator {
    //
    // Public methods.
    load(program) {
        program
            .command(`mock-routes <directory>`)
            .alias(`mr`)
            .description(`generates a mock-up routes configuration based on the contents of a directory.`)
            .option(`-c, --config-name [name]`, `name of the config file to generate.`)
            .option(`--test-run`, `does almost everything except actually generate files.`)
            .action((directory, options) => {
            this.generate(directory, options);
            process.exit();
        });
    }
    //
    // Protected methods.
    generate(directory, options) {
        let error = null;
        let cleanOptions = {
            configName: options.configName ? options.configName : 'routes.json',
            configPath: null,
            testRun: options.testRun == true
        };
        cleanOptions.configName += cleanOptions.configName.match(/\.json$/) ? '' : '.json';
        console.log(`Generating a mock-up routes`);
        console.log(`${includes_1.TAB}Working directory:  '${chalk_1.default.green(directory)}'`);
        if (!error) {
            const check = tools_1.Tools.CheckDirectory(directory, process.cwd());
            switch (check.status) {
                case tools_1.ToolsCheckPath.Ok:
                    directory = check.path;
                    break;
                case tools_1.ToolsCheckPath.WrongType:
                    error = `'${directory}' is not a directory.`;
                    break;
                default:
                    error = `'${directory}' is not a valid path.`;
                    break;
            }
        }
        if (!error) {
            cleanOptions.configPath = path.join(directory, cleanOptions.configName);
            console.log(`${includes_1.TAB}Configuration file: '${chalk_1.default.green(cleanOptions.configPath)}'`);
        }
        let routes = [];
        if (!error) {
            routes = glob_1.default.sync(path.join(directory, '**/*'))
                .sort()
                .filter((p) => {
                let stat = null;
                try {
                    stat = fs.statSync(p);
                }
                catch (e) { }
                return stat && stat.isFile();
            })
                .map((p) => p.substr(directory.length))
                .filter((p) => p !== `/${cleanOptions.configName}`)
                .map((p) => {
                return {
                    uri: p.replace(/\.[^\.]+$/, ''),
                    path: `.${p}`
                };
            });
            console.log(`${includes_1.TAB}Loaded routes:`);
            for (const r of routes) {
                console.log(`${includes_1.TAB2}- '${chalk_1.default.green(r.uri)}' (file: '${chalk_1.default.magenta(r.path)}')`);
            }
        }
        if (!error) {
            console.log(`Generating configuration file...`);
            if (!cleanOptions.testRun) {
                try {
                    fs.writeFileSync(cleanOptions.configPath, JSON.stringify({
                        guards: [],
                        routes
                    }, null, 2));
                }
                catch (err) {
                    console.error(chalk_1.default.red(`${err}`));
                }
            }
        }
        if (error) {
            console.log();
            console.error(chalk_1.default.red(error));
        }
    }
}
module.exports = new MockRoutesGeneratorClass();
