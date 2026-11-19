# SkillBridge - Run FastAPI Backend
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting SkillBridge FastAPI Backend with MySQL Connector" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Install dependencies if needed
Write-Host "Checking Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Start uvicorn
Write-Host "Launching server at http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation available at: http://localhost:8000/docs" -ForegroundColor Cyan
uvicorn main:app --reload --host 127.0.0.1 --port 8000
