# College LMS Startup Script
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   College LMS - Starting Servers" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js Version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Kill any existing Node.js processes
Write-Host "Stopping any existing Node.js processes..." -ForegroundColor Yellow
try {
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
} catch {
    # No processes to kill
}

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Green

# Start Backend Server in new window
$backendPath = Join-Path $scriptDir "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; node server.js" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Green

# Start Frontend Server in new window
$frontendPath = Join-Path $scriptDir "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev" -WindowStyle Normal

# Wait for frontend to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   College LMS Started Successfully!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3000" -ForegroundColor Blue
Write-Host "Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5000" -ForegroundColor Blue
Write-Host ""
Write-Host "Demo Accounts:" -ForegroundColor Yellow
Write-Host "Admin:   admin@college.edu / password123" -ForegroundColor White
Write-Host "Teacher: teacher@college.edu / password123" -ForegroundColor White
Write-Host "Student: student@college.edu / password123" -ForegroundColor White
Write-Host ""

# Ask user if they want to open the website
$openSite = Read-Host "Open website in browser? (Y/n)"
if ($openSite -eq "" -or $openSite -eq "Y" -or $openSite -eq "y") {
    Start-Process "http://localhost:3000"
}

Write-Host ""
Write-Host "Servers are running in separate PowerShell windows." -ForegroundColor Yellow
Write-Host "Close those windows to stop the servers." -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit this script"