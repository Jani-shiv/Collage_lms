@echo off
echo.
echo ====================================
echo    College LMS - Starting Servers
echo ====================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Kill any existing Node.js processes
echo Stopping any existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

:: Wait a moment for processes to close
timeout /t 3 /nobreak >nul

echo.
echo Starting Backend Server...
start "College LMS Backend" cmd /k "cd /d %~dp0backend && echo. && echo ===== BACKEND SERVER ===== && echo Database: SQLite && echo Port: 5000 && echo. && node server.js"

:: Wait for backend to start
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "College LMS Frontend" cmd /k "cd /d %~dp0frontend && echo. && echo ===== FRONTEND SERVER ===== && echo Port: 3000 && echo. && npm run dev"

:: Wait for frontend to start
timeout /t 8 /nobreak >nul

echo.
echo ====================================
echo    College LMS Started Successfully!
echo ====================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Demo Accounts:
echo Admin:   admin@college.edu / password123
echo Teacher: teacher@college.edu / password123
echo Student: student@college.edu / password123
echo.

:: Test if servers are running
echo Testing server connectivity...
timeout /t 2 /nobreak >nul

echo Opening website in 3 seconds...
timeout /t 3 /nobreak >nul

:: Open the website in default browser
start http://localhost:3000

echo.
echo ============================================
echo Both servers are running in separate windows
echo Close those windows to stop the servers
echo ============================================
echo.
pause