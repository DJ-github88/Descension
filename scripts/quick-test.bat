@echo off
REM Quick Test - Build and Serve Locally
echo 🧪 Starting quick local test...

cd /d "%~dp0..\vtt-react"

REM Build the application
echo 🏗️  Building application...
npm run build:netlify

if errorlevel 1 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

REM Serve the build locally
echo 🌐 Serving build locally...
npx serve -s build -l 3003

echo ✅ Build served at http://localhost:3003
