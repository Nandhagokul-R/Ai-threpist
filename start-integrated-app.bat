@echo off
setlocal EnableExtensions EnableDelayedExpansion

echo === AI Therapist: One-Click Launcher ===
echo Stopping anything already running on ports 3000, 3001, 8501, 5173, 5174...
for %%P in (3000 3001 8501 5173 5174) do (
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr :%%P ^| findstr LISTENING') do (
    echo  Killing PID %%A on port %%P
    taskkill /F /PID %%A >nul 2>&1
  )
)

echo Enabling backend demo mode (no DB required)...
set "ALLOW_DEMO=true"

echo Starting Backend (PORT 3001)...
start "AI Therapist Backend" cmd /k "cd /d D:\D\ai therepist\ai-therapist-agent-backend-main && set "ALLOW_DEMO=true" && set "PORT=3001" && npm run dev"

echo Starting Frontend (Next.js on 3000)...
start "AI Therapist Frontend" cmd /k "cd /d D:\D\ai therepist\ai-therapist-agent-main && npm run dev"

echo Starting MindPulse AI (Streamlit on 8501)...
start "MindPulse AI" cmd /k "cd /d D:\D\ai therepist\MindPulse-AI-main\MindPulse-AI-main && python -m streamlit run mindpulse.py --server.port=8501"

echo Starting Google Chatbot (Vite on 5173)...
start "Google Chatbot" cmd /k "cd /d "D:\D\ai therepist\google-chatbot (2)\google-chatbot (2)" && npm run dev"

echo Starting Voxel Toy Box (Vite on 5174)...
start "Voxel Toy Box" cmd /k "cd /d "D:\D\ai therepist\voxel-toy-box" && npm run dev"

echo.
echo All apps are starting. Open these URLs after ~10-20s:
echo   Frontend:       http://localhost:3000
echo   Backend:        http://localhost:3001/health  (demo mode)
echo   MindPulse:      http://localhost:8501
echo   Google Chatbot: http://localhost:5173
echo   Voxel Toy Box:  http://localhost:5174
echo.
echo Leave these consoles open to keep services running. Press any key to exit this launcher.
pause >nul