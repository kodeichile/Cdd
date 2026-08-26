@echo off
cd /d "%~dp0"
echo Iniciando vista previa del sitio...
echo.
echo Abre en el navegador: http://127.0.0.1:3000/
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://127.0.0.1:3000/'"
node_modules\.bin\next.cmd dev -H 127.0.0.1 -p 3000
echo.
echo El servidor se detuvo. Revisa el mensaje anterior.
pause
