@echo off
title Launch SkillBridge (All-In-One Launcher)
echo ========================================================
echo   Launching SkillBridge (Database + Web Application)
echo ========================================================
echo.

echo 1. Starting local MySQL Database engine on Port 3307...
start /min "" "%~dp0backend\run_clean_mysql.bat"

echo 2. Opening SkillBridge in your default browser...
start "" "%~dp0index.html"

echo.
echo ========================================================
echo   SkillBridge is now running!
echo   Website: Opened in your browser
echo   MySQL:   Running on Port 3307 (User: root | Pass: root123)
echo ========================================================
echo.
timeout /t 3 >nul
exit
