@echo off
echo ================================================
echo VERIFICACION RAPIDA - Configuracion CORS
echo ================================================
echo.

echo [1/3] Verificando vite.config.js...
findstr /C:"proxy" "vite.config.js" >nul
if %errorlevel% equ 0 (
    echo [OK] Proxy configurado en vite.config.js
) else (
    echo [ERROR] Proxy NO encontrado en vite.config.js
)
echo.

echo [2/3] Verificando api.config.js...
findstr /C:"import.meta.env.PROD" "src\config\api.config.js" >nul
if %errorlevel% equ 0 (
    echo [OK] BASE_URL configurada correctamente
) else (
    echo [ERROR] BASE_URL no usa URLs relativas
)
echo.

echo [3/3] Verificando backend...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8080/api/v1/auth/login
if %errorlevel% neq 0 (
    echo [WARNING] No se puede conectar al backend
    echo Asegurate de que el backend este corriendo en puerto 8080
) else (
    echo [OK] Backend responde
)
echo.

echo ================================================
echo SIGUIENTE PASO:
echo ================================================
echo.
echo 1. Si ves [OK] en todo, REINICIA el servidor de Vite:
echo    - Presiona Ctrl+C en la terminal donde corre Vite
echo    - Ejecuta: npm run dev
echo.
echo 2. Limpia cache del navegador (Ctrl+Shift+R)
echo.
echo 3. Intenta hacer login nuevamente
echo.
echo Si aun hay error, verifica que el backend este corriendo.
echo.

pause

