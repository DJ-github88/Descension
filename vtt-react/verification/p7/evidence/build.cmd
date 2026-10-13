@echo off
set "NODE_OPTIONS=--max-old-space-size=8192"
set "BUILD_PATH=D:/AppData/Temp/opencode/p7-build-final-20261013/build"
set "BABEL_CACHE_PATH=D:/AppData/Temp/opencode/p7-build-final-20261013/build-babel-cache.json"
call node node_modules/@craco/craco/dist/bin/craco.js build --config D:/AppData/Temp/opencode/p7-build-final-20261013/build.config.cjs > D:/AppData/Temp/opencode/p7-build-final-20261013/build.log 2>&1
echo %ERRORLEVEL% > D:/AppData/Temp/opencode/p7-build-final-20261013/build.exit
