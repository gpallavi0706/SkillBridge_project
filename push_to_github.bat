@echo off
title Push SkillBridge to GitHub
echo ========================================================
echo   Pushing SkillBridge to GitHub Repository:
echo   https://github.com/gpallavi0706/SkillBridge_project
echo ========================================================
echo.

cd /d "%~dp0"
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! Pushed to https://github.com/gpallavi0706/SkillBridge_project
    echo ========================================================
) else (
    echo [!] If prompted, please sign in with your GitHub account in the browser popup.
)
echo.
pause
