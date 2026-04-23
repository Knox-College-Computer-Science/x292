@echo off
echo Starting Medical Trial Matcher...
echo.

echo Starting Backend API...
cd backend
python -m venv venv 2>nul
call venv\Scripts\activate
pip install -q -r requirements.txt
start "Backend" cmd /k "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo Backend running at http://localhost:8000
echo.

timeout /t 3 /nobreak >nul

echo Starting Frontend...
cd ..\frontend
start "Frontend" cmd /k "npm install && npm run dev"
echo Frontend will be at http://localhost:5173
echo.

echo Medical Trial Matcher is starting!
echo.
echo API Documentation: http://localhost:8000/docs
echo Application: http://localhost:5173
echo.
echo Close the command windows to stop the servers
pause
