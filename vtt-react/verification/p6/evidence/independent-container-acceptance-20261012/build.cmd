@echo off
set "NODE_OPTIONS=--max-old-space-size=8192"
set "BUILD_PATH=D:/AppData/Temp/opencode/p6-container-independent-20261012/build"
set "BABEL_CACHE_PATH=D:/AppData/Temp/opencode/p6-container-independent-20261012/build-babel-cache.json"
call node node_modules/@craco/craco/dist/bin/craco.js build --config D:/AppData/Temp/opencode/p6-container-independent-20261012/build.config.cjs > D:/AppData/Temp/opencode/p6-container-independent-20261012/build.log 2>&1
echo %ERRORLEVEL% > D:/AppData/Temp/opencode/p6-container-independent-20261012/build.exit
