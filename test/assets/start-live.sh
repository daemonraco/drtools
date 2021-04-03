#!/bin/bash
#
rm -fr ./test/tmp/* 2>/dev/null 2>&1;
#
node ./test/assets/generate-test-assets.js 2>&1 | tee ./test/tmp/generate-assets.log;
#
nodemon -e js,json,html,css -i node_modules -i package.json -i src -i tsconfig.json ./test/assets/drtools-test-server.js;
