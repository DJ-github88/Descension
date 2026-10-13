@echo off
set CI=false
set NODE_OPTIONS=--max-old-space-size=8192
set BUILD_PATH=D:/AppData/Temp/opencode/p7-correction-final-build/output
node node_modules/@craco/craco/dist/bin/craco.js build --config D:/AppData/Temp/opencode/p7-correction-build.config.cjs > D:/AppData/Temp/opencode/p7-correction-final-build.log 2>&1
echo %ERRORLEVEL% > D:/AppData/Temp/opencode/p7-correction-final-build.exit
