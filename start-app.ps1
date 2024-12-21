# -------------------------------------------------------
# Script para iniciar la aplicación React y Express
# -------------------------------------------------------

# Variable para controlar si se deben instalar dependencias
$InstallDependencies = $false  # Cambia a $true si necesitas instalar dependencias

# --- Configuración del Cliente (React) ---
$clientDir = ".\client"
$clientDevCommand = "npm run dev"

# --- Configuración del Servidor (Express) ---
$serverDir = ".\server"
$serverTranspileCommand = "tsc --watch"
$serverDevCommand = "npm run dev"

# -------------------------------------------------------
# Funciones auxiliares
# -------------------------------------------------------

function Start-BackgroundProcess {
    param(
        [string]$WorkingDirectory,
        [string]$Command,
        [string]$ProcessName
    )

    Write-Host "Iniciando $ProcessName en '$WorkingDirectory'..."
    # Usar ruta completa a cmd.exe
    $process = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command & { Set-Location '$WorkingDirectory'; C:\Windows\System32\cmd.exe /c $Command}" -NoNewWindow -PassThru
    Write-Host "$ProcessName iniciado con PID: $($process.Id)"
    return $process
}

# -------------------------------------------------------
# Ejecución principal
# -------------------------------------------------------

# --- Cliente (React) ---
Write-Host "Configurando el cliente React..."
Set-Location $clientDir

if ($InstallDependencies) {
    Write-Host "Instalando dependencias del cliente..."
    npm install
}

$clientProcess = Start-BackgroundProcess -WorkingDirectory $clientDir -Command $clientDevCommand -ProcessName "Cliente React"

# --- Servidor (Express) ---
Write-Host "Configurando el servidor Express..."
Set-Location ..
Set-Location $serverDir

if ($InstallDependencies) {
    Write-Host "Instalando dependencias del servidor..."
    npm install
}

$tscProcess = Start-BackgroundProcess -WorkingDirectory $serverDir -Command $serverTranspileCommand -ProcessName "Transpilador TypeScript"

# Inicia el servidor de desarrollo
Write-Host "Iniciando el servidor Express..."
# Usar ruta completa a cmd.exe
C:\Windows\System32\cmd.exe /c $serverDevCommand

# --- Limpieza ---
Write-Host "El servidor Express ha terminado. Deteniendo procesos en segundo plano..."
Stop-Process -Id $clientProcess.Id -Force
Stop-Process -Id $tscProcess.Id -Force

Write-Host "Procesos detenidos. Saliendo del script."