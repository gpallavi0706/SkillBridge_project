@echo off
:: Must be run as Administrator
echo ========================================================
echo   MySQL 8.4 Root Password Reset Tool (New Password: root)
echo ========================================================
echo.

echo 1. Stopping MySQL service if running...
net stop MySQL84 >nul 2>&1
net stop MySQL >nul 2>&1

echo 2. Preparing reset instruction...
echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'root'; > "%TEMP%\reset_root.sql"
echo FLUSH PRIVILEGES; >> "%TEMP%\reset_root.sql"

echo 3. Applying new password 'root' to MySQL 8.4...
start /b "" "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.4\my.ini" --init-file="%TEMP%\reset_root.sql" --console

echo Waiting for password update to complete...
timeout /t 6 /nobreak >nul

taskkill /f /im mysqld.exe >nul 2>&1
del "%TEMP%\reset_root.sql" >nul 2>&1

echo.
echo 4. Starting MySQL84 service...
net start MySQL84

echo.
echo ========================================================
echo   SUCCESS! Your MySQL root password has been reset to:
echo   Username: root
echo   Password: root
echo ========================================================
echo.
pause
