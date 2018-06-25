#!/bin/bash
rm -fr ./test/tmp/* 2>/dev/null 2>&1;
#
./test/assets/unset-db.sh 2>&1 | tee ./test/tmp/generate-assets.log;
./test/assets/set-db.sh 2>&1 | tee ./test/tmp/generate-assets.log;
#
node ./test/assets/generate-test-assets.js 2>&1 | tee ./test/tmp/generate-assets.log;
#
nohup node ./test/assets/drtools-test-server.js >./test/tmp/test-server.log 2>&1 &
#
echo $! > ./test/tmp/PID;
