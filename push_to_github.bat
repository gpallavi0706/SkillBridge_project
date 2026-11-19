@echo off
title Push SkillBridge to GitHub
echo ========================================================
echo   Pushing SkillBridge to GitHub Repository:
echo   https://github.com/gpallavi0706/SkillBridge_project
echo ========================================================
echo.

cd /d "%~dp0"
echo Staging and committing any recent updates...
git add -A
git commit -m "Update SkillBridge: Career Trajectory Flow periwinkle background, Quick View modal, verified links" 2>nul
echo Uploading project files to GitHub...
git push -u origin main --force

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! Everything is now live on your GitHub!
    echo   Check: https://github.com/gpallavi0706/SkillBridge_project
    echo ========================================================
) else (
    echo [!] If there was an error, please check your internet connection or terminal message.
)
echo.
pause
