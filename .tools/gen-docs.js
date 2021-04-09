'use strict';

const chalk = require('chalk');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const semver = require('semver');
const shell = require('shelljs');
const version = require('../package.json').version;

let warnings = [];
let outdatedMds = [];

const cleanCmdHelp = text => {
    let lines = text
        .replace(/(Usage: )([^ ]+)( \[options\])/, '$1drtools-generator$3')
        .split('\n');

    while (lines.length > 0 && !lines[lines.length - 1].trim()) {
        lines.pop();
    }

    return lines.join('\n');
};

const inject = ({ mdPath, section, data, isCode, codeType }) => {
    const openPattern = new RegExp(`<!-- AUTO:${section}.* -->`);
    const closePattern = new RegExp(`<!-- /AUTO -->`);

    const mdLines = fs.readFileSync(mdPath)
        .toString()
        .split('\n');
    let newReadmeContents = '';
    let ignoring = false;
    mdLines.forEach(line => {
        if (ignoring) {
            if (line.match(closePattern)) {
                ignoring = false;

                newReadmeContents += `${line}\n`;
            }
        } else {
            newReadmeContents += `${line}\n`;
            if (line.match(openPattern)) {
                ignoring = true;

                newReadmeContents += isCode ? '```' + `${codeType ? codeType : ''}\n` : '';
                newReadmeContents += `${data}\n`;
                newReadmeContents += isCode ? '```\n' : '';
            }
        }
    });

    fs.writeFileSync(mdPath, newReadmeContents);
};

const fixmeTags = mdPath => {
    let mdLines = fs.readFileSync(mdPath).toString().split('\n');
    //
    // Replacing.
    const fixmeDocPattern = /^@(fixme|todo) doc$/;
    let newMdLines = [];
    for (const line of mdLines) {
        const match = line.match(fixmeDocPattern);
        if (match) {
            newMdLines = [
                ...newMdLines,
                '!> @fixme this section requires documentation.',
            ];
        } else {
            newMdLines.push(line);
        }
    }
    //
    // Loading warnings for further report.
    const titlePattern = /^([#]+)(| )(.*)$/;
    const warningPattern = /^(.*)@(fixme|todo) (.+)$/;
    let lastTitle = '';
    for (const line of mdLines) {
        const matchTitle = line.match(titlePattern);
        if (matchTitle) {
            lastTitle = matchTitle[3];
        }

        const warningMatch = line.match(warningPattern);
        if (warningMatch) {
            warnings.push({
                path: mdPath,
                title: lastTitle.trim(),
                warning: `${warningMatch[3]}${warningMatch[3][warningMatch[3].length - 1] === '.' ? '' : '...'}`,
            });
        }
    }
    //
    // Writing new contents.
    fs.writeFileSync(mdPath, newMdLines.join('\n'));
};

const removeTrailingEmptyLines = mdPath => {
    const mdLines = fs.readFileSync(mdPath)
        .toString()
        .split('\n');

    while (mdLines[mdLines.length - 1] === '') {
        mdLines.pop();
    }
    mdLines.push('');

    fs.writeFileSync(mdPath, mdLines.join('\n'));
};

const versionWarnings = mdPath => {
    let mdLines = fs.readFileSync(mdPath)
        .toString()
        .split('\n');
    //
    // Patterns.
    const tagPattern = /^<!-- version-check:([.0-9]+) -->$/;
    const warningClosePattern = /^<!-- \/version-warning -->$/;
    const warningOpenPattern = /^<!-- version-warning -->$/;
    //
    // Checking for the version tag.
    let mdVersion = '';
    for (const line of mdLines) {
        const match = line.match(tagPattern);
        if (match) {
            mdVersion = match[1];
        }
    }
    //
    // Checking for the version tag.
    let hasWarningCloseTag = false;
    let hasWarningOpenTag = false;
    for (const line of mdLines) {
        let match = line.match(warningClosePattern);
        if (match) {
            hasWarningCloseTag = true;
            continue;
        }

        match = line.match(warningOpenPattern);
        if (match) {
            hasWarningOpenTag = true;
            continue;
        }
    }
    //
    // Enforcing the warning section.
    if (!hasWarningCloseTag || !hasWarningOpenTag) {
        mdLines = [
            '<!-- version-warning -->',
            '<!-- /version-warning -->',
            '',
            ...mdLines,
        ];
    }
    //
    // Checking version tags.
    let needsWarning = false;
    if (mdVersion) {
        needsWarning = semver.diff(mdVersion, version) !== null;
    } else {
        mdLines = [
            `<!-- version-check:${version} -->`,
            ...mdLines,
        ];
        mdVersion = version;
    }
    if (needsWarning) {
        outdatedMds.push({
            path: mdPath,
            since: mdVersion,
        });
    }
    //
    // Building warning.
    const warningLines = needsWarning ? [
        '!>__<span style="color:red">WARNING: THIS DOCUMENT IS OUT OF DATE SINCE VERSION',
        `${mdVersion}</span>__`,
    ] : [];
    //
    // Injecting.
    let newMdLines = [];
    let opened = false;
    for (const line of mdLines) {
        if (line.match(warningOpenPattern)) {
            opened = true;
            newMdLines = [
                ...newMdLines,
                line,
                ...warningLines,
            ];
        }
        if (line.match(warningClosePattern)) {
            opened = false;
        }

        if (!opened) {
            newMdLines.push(line);
        }
    }
    //
    // Writing new contents.
    fs.writeFileSync(mdPath, newMdLines.join('\n'));
};

(async () => {
    const pieces = {}
    const piecesSteps = [];

    [
        ['server-options', `node ${path.join(__dirname, '../dist/commands/server/cmd.js')} --help`],
        ['generator-options', `node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} --help`],
        ['generator-options:mock-routes', `node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} mock-routes --help`],
        ['generator-options:middlewares', `node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} middleware --help`],
        ['generator-options:plugins', `node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} plugin --help`],
        ['generator-options:routes', `node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} route --help`],
        ['generator-options:tasks', `node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} task --help`],
    ].forEach(([name, cmdStr]) => {
        piecesSteps.push({
            name,
            function: name => {
                const cmd = shell.exec(cmdStr, { silent: true });
                pieces[name] = cleanCmdHelp(cmd.stdout);
            }
        });
    });

    const steps = [];
    steps.push(mdPath => inject({ mdPath, section: 'server-options', data: pieces['server-options'], isCode: true }));
    steps.push(mdPath => inject({ mdPath, section: 'generator-options', data: pieces['generator-options'], isCode: true }));
    steps.push(mdPath => inject({ mdPath, section: 'generator-options:mock-routes', data: pieces['generator-options:mock-routes'], isCode: true }));
    steps.push(mdPath => inject({ mdPath, section: 'generator-options:middlewares', data: pieces['generator-options:middlewares'], isCode: true }));
    steps.push(mdPath => inject({ mdPath, section: 'generator-options:plugins', data: pieces['generator-options:plugins'], isCode: true }));
    steps.push(mdPath => inject({ mdPath, section: 'generator-options:routes', data: pieces['generator-options:routes'], isCode: true }));
    steps.push(mdPath => inject({ mdPath, section: 'generator-options:tasks', data: pieces['generator-options:tasks'], isCode: true }));
    steps.push(mdPath => removeTrailingEmptyLines(mdPath));
    steps.push(mdPath => versionWarnings(mdPath));
    steps.push(mdPath => fixmeTags(mdPath));

    let mdPaths = glob.sync('docs/**/*.md');
    mdPaths.push('README.md');
    mdPaths = mdPaths.sort();

    for (const piece of piecesSteps) {
        console.log(`Loading piece '${chalk.green(piece.name)}'`);
        await piece.function(piece.name);
    }

    console.log('');
    for (const mdPath of mdPaths) {
        console.log(`Updating '${chalk.green(mdPath)}'`);
        for (const step of steps) {
            await step(mdPath);
        }
    }

    let todoMdLines = [];
    if (outdatedMds.length > 0) {
        todoMdLines = [
            ...todoMdLines,
            ...['', '## Outdated Documents'],
        ];

        console.log(chalk.red(`\nThese docs are out of date:`));
        for (const entry of outdatedMds) {
            console.log(chalk.red(`\t'${entry.path}' since '${entry.since}'`));
            todoMdLines.push(`* [${entry.path}](${path.basename(entry.path)}): since __${entry.since}__.`);
        }
        todoMdLines.push('');
    }
    if (warnings.length > 0) {
        todoMdLines = [
            ...todoMdLines,
            ...['', '## Document Warnings'],
        ];

        console.log(chalk.red(`\nThese warnings were found:`));
        for (const entry of warnings) {
            console.log(chalk.red(`\tDocument '${entry.path}' has warning under '${entry.title}'`));
            const id = entry.title.toLowerCase().replace(/ /g, '-');
            todoMdLines.push(`* [${entry.title} (${entry.path})](${path.basename(entry.path)}?id=${id}): ${entry.warning}`);
        }
    }

    if (todoMdLines.length < 1) {
        todoMdLines = ['There seems to be nothing pending regarding documentation.'];
    }

    todoMdLines.unshift('# Documentation TODOs');
    await fs.writeFile(path.join(__dirname, '../docs/todo.md'), todoMdLines.join('\n'));

    process.exit();
})();
