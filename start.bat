@echo off
title FixIt Launcher
echo ============================================
echo   FixIt Home Services - One Click Start
echo ============================================
echo.

echo [1/4] Stopping old servers (ports 3000/5000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Starting Backend (http://localhost:5000)...
start "FixIt Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo [3/4] Starting Frontend (http://localhost:3000)...
start "FixIt Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo [4/4] Waiting for servers to boot...
timeout /t 12 /nobreak >nul
start http://localhost:3000

echo.
echo All done! Backend and Frontend are running.
echo Close the "FixIt Backend" and "FixIt Frontend" windows to stop them.
timeout /t 30 >nul
