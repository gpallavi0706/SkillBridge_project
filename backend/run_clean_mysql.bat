@echo off
title SkillBridge MySQL 8.4 Server (Port 3307 - Password: root123)
echo ============================================================
echo   SkillBridge Local MySQL 8.4 Server (Port 3307)
echo ============================================================
echo.

echo 1. Stopping any prior process on port 3307...
taskkill /f /im mysqld.exe >nul 2>&1

REM One-time auto-initialization if db_data is missing
if not exist "%~dp0db_data" (
    echo [Setup] Initializing clean database storage (takes ~4 seconds)...
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --initialize-insecure --datadir="%~dp0db_data" --console >nul 2>&1
)

echo 2. Launching MySQL 8.4 Server on Port 3307 with password root123...
start /b "" "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --datadir="%~dp0db_data" --port=3307 --init-file="%~dp0set_password.sql" --console

echo 3. Waiting 5 seconds for database engine to initialize...
timeout /t 5 /nobreak >nul

echo 4. Automatically importing schema.sql (15 tables, 4 views, 100+ rows)...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3307 -u root -proot123 < "%~dp0schema.sql"

echo.
echo ============================================================
echo   DATABASE ONLINE! YOUR EXACT CREDENTIALS:
echo.
echo   Hostname: 127.0.0.1
echo   Port:     3307
echo   Username: root
echo   PASSWORD: root123
echo   Database: skillbridge_db
echo ============================================================
echo.
echo Launching MySQL Workbench...
start "" "C:\Program Files\MySQL\MySQL Workbench\MySQL Workbench.exe"

echo.
echo KEEP THIS WINDOW OPEN while using MySQL!
pause
