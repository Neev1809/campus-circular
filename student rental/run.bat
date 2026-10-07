@echo off
title WebFusion - Student Rental Dev Server
cd /d "%~dp0"

echo ========================================================
echo        Starting WebFusion Development Server...
echo ========================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check dependencies
if not exist "node_modules\" (
    echo [INFO] Installing project dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed!
        pause
        exit /b 1
    )
)

echo [INFO] Starting Vite dev server...
echo.
call npm run dev -- --open

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Dev server stopped unexpectedly.
    pause
)
