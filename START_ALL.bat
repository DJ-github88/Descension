@echo off
echo ====================================
echo Mythrill VTT - Start All Servers
echo ====================================
echo.
echo This will start BOTH:
echo   1. Frontend (React) on port 3000
echo   2. Socket.IO Backend on port 3001
echo.
echo Press Ctrl+C to stop both servers
echo.
pause

:: Change to root directory
cd /d "%~dp0"

:: Start both servers concurrently
start "Frontend" cmd /k "cd vtt-react && npm start"
start "Backend" cmd /k "cd server && npm start"

echo.
echo ====================================
echo Servers starting...
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.
echo Close this window to stop both servers.
echo.
