@echo off
cd /d "%~dp0"
title Centro Medico Dental - localhost
echo Iniciando el sitio en http://127.0.0.1:3000/
echo.
echo IMPORTANTE: deja esta ventana abierta mientras revisas la pagina.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://127.0.0.1:3000/'"
node_modules\.bin\next.cmd dev -H 127.0.0.1 -p 3000
echo.
echo El servidor se detuvo. Revisa el mensaje anterior.
pause
