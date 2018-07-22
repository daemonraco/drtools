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
    name: 'generator-options:plugins',
    function: (name, next) => {
        suppose('node', [path.join(__dirname, '../dist/commands/generator/cmd.js'), 'plugin', '--help'], {
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
piecesSteps.push({
    name: 'generator-options:webtoapi',
    function: (name, next) => {
        suppose('node', [path.join(__dirname, '../dist/commands/generator/cmd.js'), 'webtoapi', '--help'], {
            debug: fs.createWriteStream(resultsPath)
        }).end(code => {
            pieces[name] = cleanCmdHelp();
            next();
        });
    }
});
piecesSteps.push({
    name: 'webtoapi:specs',
    function: (name, next) => {
        const { WebToApiConfigSpec } = require('../dist/core/webtoapi/spec.config.js');
        pieces[name] = JSON.stringify(WebToApiConfigSpec, null, 4);
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
    inject({ mdPath, section: 'generator-options:webtoapi', data: pieces['generator-options:webtoapi'], isCode: true }, next);
});
steps.push((mdPath, next) => {
    inject({ mdPath, section: 'webtoapi:specs', data: pieces['webtoapi:specs'], isCode: true, codeType: 'json' }, next);
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
