#!/bin/bash

echo "🚀 Starting Medical Trial Matcher..."
echo ""

# Start backend
echo "📦 Starting Backend API..."
cd backend
python -m venv venv 2>/dev/null || true
source venv/bin/activate || source venv/Scripts/activate
pip install -q -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✅ Backend running at http://localhost:8000"
echo ""

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend..."
cd ../frontend
npm install 2>/dev/null
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend running at http://localhost:5173"
echo ""

echo "🎉 Medical Trial Matcher is ready!"
echo ""
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🌐 Application: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
