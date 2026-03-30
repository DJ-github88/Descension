@echo off
REM Quick Deploy to Netlify - Batch Script
setlocal enabledelayedexpansion

REM Default commit message
set "COMMIT_MSG=Quick multiplayer fix"
if not "%~1"=="" set "COMMIT_MSG=%~1"

echo 🚀 Starting quick Netlify deployment...
echo.

REM Change to project root (scripts folder is one level down)
cd /d "%~dp0.."

REM Add all changes
echo 📝 Adding all changes...
git add .

REM Get timestamp
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set "TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%"

REM Commit with timestamp
set "FULL_MSG=%COMMIT_MSG% - %TIMESTAMP%"
echo 💾 Committing: !FULL_MSG!
git commit -m "!FULL_MSG!"

REM Check if commit succeeded
if errorlevel 1 (
    echo ❌ Commit failed!
    pause
    exit /b 1
)

REM Push to master
echo ⬆️  Pushing to master...
git push origin master

REM Check if push succeeded
if errorlevel 1 (
    echo ❌ Push failed!
    pause
    exit /b 1
)

REM Build locally for faster deployment
echo 🏗️  Building application...
cd vtt-react
npm run build:netlify

REM Check if build succeeded
if errorlevel 1 (
    echo ❌ Build failed!
    cd ..
    pause
    exit /b 1
)

echo ✅ Build successful!
cd ..

REM Show deployment instructions
echo.
echo 🎯 DEPLOYMENT READY!
echo Go to https://app.netlify.com/sites/mythrill/deploys
echo Click 'Trigger deploy' -^> 'Deploy site'
echo.
echo Or drag the 'vtt-react\build' folder to Netlify dashboard for instant deploy
echo.
echo Build folder: %CD%\vtt-react\build

echo.
echo ⏱️  Deployment script completed successfully!

pause
