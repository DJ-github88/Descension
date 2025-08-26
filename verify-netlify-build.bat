@echo off
echo ========================================
echo Verifying Netlify Build Configuration
echo ========================================

cd vtt-react

echo.
echo 1. Cleaning previous build...
rmdir /s /q build 2>nul
rmdir /s /q node_modules 2>nul

echo.
echo 2. Installing dependencies (like Netlify)...
call npm ci --force

echo.
echo 3. Building with production settings...
set NODE_ENV=production
set GENERATE_SOURCEMAP=false
set CI=true
set NODE_OPTIONS=--max-old-space-size=8192
set REACT_APP_BUILD_MODE=production
set REACT_APP_ENV=production
call npm run build

echo.
echo 4. Checking build output...
if exist build\index.html (
    echo ✅ Build successful - index.html exists
) else (
    echo ❌ Build failed - index.html not found
    exit /b 1
)

if exist build\static\js (
    echo ✅ JavaScript files generated
) else (
    echo ❌ JavaScript files missing
    exit /b 1
)

if exist build\static\css (
    echo ✅ CSS files generated
) else (
    echo ❌ CSS files missing
    exit /b 1
)

echo.
echo 5. Starting local server to test...
echo Starting server on http://localhost:3000
echo Press Ctrl+C to stop
call npx serve -s build -l 3000

cd ..
