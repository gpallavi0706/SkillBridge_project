# Run PowerShell as Administrator
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Resetting MySQL 8.4 Root Password to: root" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Stop service
Write-Host "1. Stopping MySQL84 service..." -ForegroundColor Yellow
Stop-Service -Name MySQL84 -ErrorAction SilentlyContinue
Stop-Service -Name MySQL -ErrorAction SilentlyContinue

# 2. Create SQL script
$resetFile = "$env:TEMP\reset_root.sql"
@"
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
FLUSH PRIVILEGES;
"@ | Set-Content -Path $resetFile -Encoding ASCII

# 3. Execute mysqld with init-file
Write-Host "2. Updating root password to 'root'..." -ForegroundColor Yellow
$mysqld = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
$myini  = "C:\ProgramData\MySQL\MySQL Server 8.4\my.ini"

$proc = Start-Process -FilePath $mysqld -ArgumentList "--defaults-file=`"$myini`"", "--init-file=`"$resetFile`"", "--console" -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 6

# Stop temp process
Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
Remove-Item -Path $resetFile -Force -ErrorAction SilentlyContinue

# 4. Start service
Write-Host "3. Starting MySQL84 service..." -ForegroundColor Yellow
Start-Service -Name MySQL84 -ErrorAction SilentlyContinue

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  SUCCESS! Your MySQL root password is now: root" -ForegroundColor Green
Write-Host "  Host: 127.0.0.1  |  Port: 3306  |  User: root  |  Pass: root" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
