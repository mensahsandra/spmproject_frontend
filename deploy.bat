@echo off
REM Quick deployment script for attendance notification fix (Windows)

echo.
echo Starting deployment process...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found. Are you in the frontend directory?
    pause
    exit /b 1
)

REM Stage all changes
echo Staging changes...
git add .
echo.

REM Commit with message
echo Committing changes...
git commit -m "Fix: Attendance notification system - real-time QR scan alerts now working"
echo.

REM Push to GitHub
echo Pushing to GitHub...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo Successfully pushed to GitHub!
    echo.
    echo Vercel will auto-deploy in ~2-3 minutes
    echo Production URL: https://spmproject-web.vercel.app
    echo.
) else (
    echo.
    echo Push failed! Please check the error above.
    echo.
    pause
    exit /b 1
)

pause
