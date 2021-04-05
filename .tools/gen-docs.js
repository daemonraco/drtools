'use strict';

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const semver = require('semver');
const shell = require('shelljs');
const version = require('../package.json').version;

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

const removeTrailingEmptyLines = mdPath => {
    const mdLines = fs.readFileSync(mdPath)
        .toString()
        .split('\n');

    while (mdLines[mdLines.length - 1] === '') {
        mdLines.pop();
    }
    mdLines.push('');

    fs.writeFileSync(mdPath, mdLines.join('\n'));
}

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
        needsWarning = !semver.diff(mdVersion, version);
    } else {
        mdLines = [
            ...mdLines,
            `<!-- version-check:${version} -->`,
            '',
        ];
        needsWarning = true;
    }
    //
    // Building warning.
    const warningLines = needsWarning ? [] : [
        '!>__<span style="color:red">WARNING: THIS DOCUMENT IS REALLY OUT OF DATE SINCE',
        `VERSION ${mdVersion}</span>__`,
    ];
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
}

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

    let mdPaths = glob.sync('docs/**/*.md');
    mdPaths.push('README.md');
    mdPaths = mdPaths.sort();

    for (const piece of piecesSteps) {
        console.log(`Loading piece '${piece.name}'`);
        await piece.function(piece.name);
    }

    for (const mdPath of mdPaths) {
        console.log(`Updating '${mdPath}'`);
        for (const step of steps) {
            await step(mdPath);
        }
    }

    process.exit();
})();
