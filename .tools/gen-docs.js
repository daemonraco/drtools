'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const suppose = require('suppose');
const { tmpdir } = require('os');

const resultsPath = path.join(tmpdir(), `${Math.random().toString(36).replace(/[^a-z]+/g, '')}.out`);

const inject = (mdPath, section, data, isCode, next) => {
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

                newReadmeContents += isCode ? '```\n' : '';
                newReadmeContents += `${data}\n`;
                newReadmeContents += isCode ? '```\n' : '';
            }
        }
    });

    fs.writeFileSync(mdPath, newReadmeContents);
    next();
};

const steps = [];
steps.push((mdPath, next) => {
    suppose('node', [path.join(__dirname, '../commands/server.js'), '--help'], {
        debug: fs.createWriteStream(resultsPath)
    }).end(code => {
        let lines = fs.readFileSync(resultsPath)
            .toString()
            .replace(/(Usage: )([^ ]+)( \[options\])/, '$1drtools-server$3')
            .split('\n')
            .filter(x => x);

        const separator = /^[-]+$/;
        let ignore = true;
        lines = lines.filter(x => {
            if (ignore) {
                if (x.match(separator)) {
                    ignore = false;
                }
                return false;
            } else {
                return true;
            }
        });

        inject(mdPath, 'server-options', lines.join('\n'), true, next);
    });
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
        fs.unlink(resultsPath);
        process.exit();
    }
}
runFile();
