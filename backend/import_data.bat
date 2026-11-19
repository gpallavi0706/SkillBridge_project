@echo off
echo ========================================================
echo   Importing SkillBridge Database (Password: root123)
echo ========================================================
echo.

echo Trying Port 3307 first...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3307 -u root -proot123 < "%~dp0schema.sql" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! All 15 tables and views imported to Port 3307!
    echo   Database: skillbridge_db
    echo ========================================================
    goto done
)

echo Port 3307 not reachable. Trying standard Port 3306...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u root -proot123 < "%~dp0schema.sql" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! All 15 tables and views imported to Port 3306!
    echo   Database: skillbridge_db
    echo ========================================================
    goto done
)

echo.
echo [!] Could not connect to either Port 3307 or 3306 with password 'root123'.
echo     Please run run_clean_mysql.bat first to start the database server!

:done
echo.
pause
