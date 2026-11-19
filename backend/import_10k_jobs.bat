@echo off
title SkillBridge - Import 10,000+ Naukri & LinkedIn Jobs
echo ========================================================
echo   SkillBridge: Importing 10,240+ Naukri & LinkedIn Jobs
echo ========================================================
echo.

echo Checking connection on Port 3307...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3307 -u root -proot123 -e "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [✓] Connected to MySQL on Port 3307!
    echo Importing 10,240 jobs into skillbridge_db (takes ~3-5 seconds)...
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3307 -u root -proot123 < "%~dp0populate_10k_jobs.sql"
    goto verify_3307
)

echo Checking connection on standard Port 3306...
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u root -proot123 -e "SELECT 1;" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [✓] Connected to MySQL on Port 3306!
    echo Importing 10,240 jobs into skillbridge_db (takes ~3-5 seconds)...
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u root -proot123 < "%~dp0populate_10k_jobs.sql"
    goto verify_3306
)

echo.
echo [X] Could not connect to MySQL on Port 3307 or 3306 with password 'root123'.
echo     Please make sure your MySQL server is running first!
goto end

:verify_3307
echo.
echo ========================================================
echo   IMPORT COMPLETE! Total Opportunities in MySQL (Port 3307):
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3307 -u root -proot123 -e "USE skillbridge_db; SELECT COUNT(*) AS total_jobs FROM opportunities;"
echo ========================================================
goto end

:verify_3306
echo.
echo ========================================================
echo   IMPORT COMPLETE! Total Opportunities in MySQL (Port 3306):
"C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u root -proot123 -e "USE skillbridge_db; SELECT COUNT(*) AS total_jobs FROM opportunities;"
echo ========================================================
goto end

:end
echo.
pause
