@echo off
echo ========================================
echo  Building and serving like Netlify
echo ========================================
echo.
echo This will:
echo 1. Clean all build artifacts
echo 2. Fresh install dependencies 
echo 3. Build with production settings
echo 4. Serve on localhost:3000
echo.
echo Press Ctrl+C to stop the server when done
echo ========================================
echo.

cd vtt-react
npm run netlify:local
