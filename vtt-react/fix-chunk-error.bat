@echo off
echo Fixing chunk loading error...

echo.
echo Step 1: Stopping any running development servers...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Clearing build cache...
if exist build rmdir /s /q build
if exist .cache rmdir /s /q .cache

echo.
echo Step 3: Clearing npm cache...
npm cache clean --force

echo.
echo Step 4: Starting development server...
echo.
echo IMPORTANT: When the server starts, please:
echo 1. Clear your browser cache (Ctrl+Shift+Delete)
echo 2. Hard refresh the page (Ctrl+F5)
echo 3. If the error persists, try opening in an incognito/private window
echo.
npm start
