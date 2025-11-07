@echo off
echo ========================================
echo Testing Netlify Build Locally
echo ========================================
echo.
echo This script replicates Netlify's exact build process
echo to help debug deployment issues.
echo.

cd vtt-react

echo 1. Cleaning build artifacts...
if exist build rmdir /s /q build
if exist node_modules rmdir /s /q node_modules
if exist .cache rmdir /s /q .cache

echo.
echo 2. Installing dependencies (like Netlify)...
call npm ci --force

echo.
echo 3. Building with Netlify environment variables...
set NODE_VERSION=18
set NODE_ENV=production
set GENERATE_SOURCEMAP=false
set CI=true
set NODE_OPTIONS=--max-old-space-size=8192
set REACT_APP_BUILD_MODE=production
set REACT_APP_ENV=production
set INLINE_RUNTIME_CHUNK=false
set BROWSERSLIST_ENV=production
set REACT_APP_SOCKET_URL=https://descension-mythrill.up.railway.app
set BUILD_TIMESTAMP=2025-01-26-hud-css-fixes

call npm run build

echo.
echo 4. Checking build output...
if exist build\index.html (
    echo ✅ Build successful - index.html exists
    echo.
    echo 📁 Build contents:
    dir build /b
    echo.
    echo 🔍 Checking for CSS files:
    dir build\static\css /b 2>nul || echo No CSS files found
    echo.
    echo 🎯 You can now test this build by running:
    echo    cd vtt-react
    echo    npx serve -s build -l 3000
) else (
    echo ❌ Build failed - index.html not found
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed! 
echo ========================================
pause
