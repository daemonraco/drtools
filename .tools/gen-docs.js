'use strict';

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const suppose = require('suppose');
const { tmpdir } = require('os');

const resultsPath = path.join(tmpdir(), `${Math.random().toString(36).replace(/[^a-z]+/g, '')}.out`);

const cleanCmdHelp = () => {
    let lines = fs.readFileSync(resultsPath)
        .toString()
        .replace(/(Usage: )([^ ]+)( \[options\])/, '$1drtools-generator$3')
        .split('\n');

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

    return lines.join('\n');
}
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

const pieces = {}
const piecesSteps = [];
piecesSteps.push({
    name: 'server-options',
    function: (name, next) => {
        suppose('node', [path.join(__dirname, '../dist/commands/server/cmd.js'), '--help'], {
            debug: fs.createWriteStream(resultsPath)
        }).end(code => {
            pieces[name] = cleanCmdHelp();
            next();
        });
    }
});
piecesSteps.push({
    name: 'generator-options',
    function: (name, next) => {
        suppose('node', [path.join(__dirname, '../dist/commands/generator/cmd.js'), '--help'], {
            debug: fs.createWriteStream(resultsPath)
        }).end(code => {
            pieces[name] = cleanCmdHelp();
            next();
        });
    }
});
piecesSteps.push({
    name: 'generator-options:mock-routes',
    function: (name, next) => {
        suppose('node', [path.join(__dirname, '../dist/commands/generator/cmd.js'), 'mock-routes', '--help'], {
            debug: fs.createWriteStream(resultsPath)
        }).end(code => {
            pieces[name] = cleanCmdHelp();
            next();
        });
    }
});
piecesSteps.push({
    name: 'generator-options:middlewares',
    function: (name, next) => {
        suppose('node', [path.join(__dirname, '../dist/commands/generator/cmd.js'), 'middleware', '--help'], {
            debug: fs.createWriteStream(resultsPath)
        }).end(code => {
            pieces[name] = cleanCmdHelp();
            next();
        });
    }
});
piecesSteps.push({
    name: 'generator-options:routes',
    function: (name, next) => {
        suppose('node', [path.join(__dirname, '../dist/commands/generator/cmd.js'), 'route', '--help'], {
            debug: fs.createWriteStream(resultsPath)
        }).end(code => {
            pieces[name] = cleanCmdHelp();
            next();
        });
    }
});
piecesSteps.push({
    name: 'generator-options:tasks',
    function: (name, next) => {
        suppose('node', [path.join(__dirname, '../dist/commands/generator/cmd.js'), 'task', '--help'], {
            debug: fs.createWriteStream(resultsPath)
        }).end(code => {
            pieces[name] = cleanCmdHelp();
            next();
        });
    }
});

const steps = [];
steps.push((mdPath, next) => {
    inject(mdPath, 'server-options', pieces['server-options'], true, next);
});
steps.push((mdPath, next) => {
    inject(mdPath, 'generator-options', pieces['generator-options'], true, next);
});
steps.push((mdPath, next) => {
    inject(mdPath, 'generator-options:mock-routes', pieces['generator-options:mock-routes'], true, next);
});
steps.push((mdPath, next) => {
    inject(mdPath, 'generator-options:middlewares', pieces['generator-options:middlewares'], true, next);
});
steps.push((mdPath, next) => {
    inject(mdPath, 'generator-options:routes', pieces['generator-options:routes'], true, next);
});
steps.push((mdPath, next) => {
    inject(mdPath, 'generator-options:tasks', pieces['generator-options:tasks'], true, next);
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
        fs.unlink(resultsPath, () => null);
        process.exit();
    }
}

runPiece();
