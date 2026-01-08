@echo off
echo ========================================
echo  Synchronizing Build Environment
echo ========================================
echo.
echo This script ensures your local environment
echo matches the Netlify production environment
echo.

cd vtt-react

echo 1. Cleaning existing dependencies...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo 2. Installing exact dependencies (like Netlify)...
npm ci --force

echo 3. Verifying package versions...
npm ls --depth=0

echo.
echo ========================================
echo  Build Environment Synchronized!
echo ========================================
echo.
echo Your local environment now matches Netlify.
echo You can now run:
echo   npm start    - for development
echo   npm run build - for production build
echo.
pause
