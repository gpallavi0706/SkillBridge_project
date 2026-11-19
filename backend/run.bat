@echo off
echo ==========================================================
echo  Starting SkillBridge FastAPI Backend with MySQL Connector
echo ==========================================================
echo Installing / checking Python dependencies...
pip install -r requirements.txt
echo.
echo Launching FastAPI on http://localhost:8000
echo Swagger UI documentation: http://localhost:8000/docs
echo.
uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
