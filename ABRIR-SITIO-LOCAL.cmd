@echo off
cd /d "%~dp0"
title Centro Medico Dental - vista local
echo.
echo Abriendo Centro Medico Dental en:
echo http://127.0.0.1:3000/
echo.
echo Deja esta ventana abierta. Si la cierras, la pagina deja de funcionar.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://127.0.0.1:3000/'"
node_modules\.bin\next.cmd dev -H 127.0.0.1 -p 3000
echo.
echo El servidor se detuvo. Copia el error de arriba si vuelve a fallar.
pause
