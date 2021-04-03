'use strict';

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const shell = require('shelljs');

(async () => {
    const cleanCmdHelp = text => {
        let lines = text
            .replace(/(Usage: )([^ ]+)( \[options\])/, '$1drtools-generator$3')
            .split('\n');

        while (lines.length > 0 && !lines[lines.length - 1].trim()) {
            lines.pop();
        }

        return lines.join('\n');
    }
    const inject = ({ mdPath, section, data, isCode, codeType }, next) => {
        const openPattern = new RegExp(`<!-- AUTO:${section}.* -->`);
        const closePattern = new RegExp(`<!-- /AUTO -->`);

        const readmeLines = fs.readFileSync(mdPath)
            .toString()
            .split('\n');
        let newReadmeContents = '';
        let ignoring = false;
        readmeLines.forEach(line => {
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
        next();
    };

    const pieces = {}
    const piecesSteps = [];
    piecesSteps.push({
        name: 'server-options',
        function: (name, next) => {
            const cmd = shell.exec(`node ${path.join(__dirname, '../dist/commands/server/cmd.js')} --help`, { silent: true });
            pieces[name] = cleanCmdHelp(cmd.stdout);
            next();
        }
    });
    piecesSteps.push({
        name: 'generator-options',
        function: (name, next) => {
            const cmd = shell.exec(`node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} --help`, { silent: true });
            pieces[name] = cleanCmdHelp(cmd.stdout);
            next();
        }
    });
    piecesSteps.push({
        name: 'generator-options:mock-routes',
        function: (name, next) => {
            const cmd = shell.exec(`node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} mock-routes --help`, { silent: true });
            pieces[name] = cleanCmdHelp(cmd.stdout);
            next();
        }
    });
    piecesSteps.push({
        name: 'generator-options:middlewares',
        function: (name, next) => {
            const cmd = shell.exec(`node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} middleware --help`, { silent: true });
            pieces[name] = cleanCmdHelp(cmd.stdout);
            next();
        }
    });
    piecesSteps.push({
        name: 'generator-options:plugins',
        function: (name, next) => {
            const cmd = shell.exec(`node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} plugin --help`, { silent: true });
            pieces[name] = cleanCmdHelp(cmd.stdout);
            next();
        }
    });
    piecesSteps.push({
        name: 'generator-options:routes',
        function: (name, next) => {
            const cmd = shell.exec(`node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} route --help`, { silent: true });
            pieces[name] = cleanCmdHelp(cmd.stdout);
            next();
        }
    });
    piecesSteps.push({
        name: 'generator-options:tasks',
        function: (name, next) => {
            const cmd = shell.exec(`node ${path.join(__dirname, '../dist/commands/generator/cmd.js')} task --help`, { silent: true });
            pieces[name] = cleanCmdHelp(cmd.stdout);
            next();
        }
    });

    const steps = [];
    steps.push((mdPath, next) => {
        inject({ mdPath, section: 'server-options', data: pieces['server-options'], isCode: true }, next);
    });
    steps.push((mdPath, next) => {
        inject({ mdPath, section: 'generator-options', data: pieces['generator-options'], isCode: true }, next);
    });
    steps.push((mdPath, next) => {
        inject({ mdPath, section: 'generator-options:mock-routes', data: pieces['generator-options:mock-routes'], isCode: true }, next);
    });
    steps.push((mdPath, next) => {
        inject({ mdPath, section: 'generator-options:middlewares', data: pieces['generator-options:middlewares'], isCode: true }, next);
    });
    steps.push((mdPath, next) => {
        inject({ mdPath, section: 'generator-options:plugins', data: pieces['generator-options:plugins'], isCode: true }, next);
    });
    steps.push((mdPath, next) => {
        inject({ mdPath, section: 'generator-options:routes', data: pieces['generator-options:routes'], isCode: true }, next);
    });
    steps.push((mdPath, next) => {
        inject({ mdPath, section: 'generator-options:tasks', data: pieces['generator-options:tasks'], isCode: true }, next);
    });
    steps.push((mdPath, next) => {
        const readmeLines = fs.readFileSync(mdPath)
            .toString()
            .split('\n');

        while (readmeLines[readmeLines.length - 1] === '') {
            readmeLines.pop();
        }
        readmeLines.push('');

        fs.writeFileSync(mdPath, readmeLines.join('\n'));
        next();
    });

    let mdPaths = glob.sync('docs/**/*.md');
    mdPaths.push('README.md');
    mdPaths = mdPaths.sort();

    const runPiece = () => {
        const piece = piecesSteps.shift();

        if (piece) {
            console.log(`Loading piece '${piece.name}'`);
            piece.function(piece.name, runPiece);
        } else {
            runFile();
        }
    }

    const runFile = () => {
        const mdPath = mdPaths.shift();

        if (mdPath) {
            console.log(`Updating '${mdPath}'`);
            let stepsPositions = Object.keys(steps);
            const run = () => {
                const step = stepsPositions.shift();
                if (steps[step]) {
                    steps[step](mdPath, run);
                } else {
                    runFile();
                }
            }
            run();
        } else {
            process.exit();
        }
    }

    runPiece();
})();
