# -------------------------------------------------------
# Script para iniciar la aplicación React y Express
# -------------------------------------------------------

# Variable para controlar si se deben instalar dependencias
$InstallDependencies = $false  # Cambia a $true si necesitas instalar dependencias

# --- Configuración del Cliente (React) ---
$clientDir = "E:\usc-certificates-react-express\client"  # Ruta absoluta al cliente
$clientDevCommand = "npm run dev"

# --- Configuración del Servidor (Express) ---
$serverDir = "E:\usc-certificates-react-express\server"  # Ruta absoluta al servidor
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
    $process = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command & { Set-Location '$WorkingDirectory'; $Command}" -NoNewWindow -PassThru
    Write-Host "$ProcessName iniciado con PID: $($process.Id)"
    return $process
}

# -------------------------------------------------------
# Ejecución principal
# -------------------------------------------------------

# Verifica el directorio actual
Write-Host "Directorio actual: $(Get-Location)"

# --- Cliente (React) ---
Write-Host "Configurando el cliente React..."
if (-Not (Test-Path $clientDir)) {
    Write-Host "Error: No se encontró el directorio '$clientDir'. Verifica la ruta."
    exit 1
}
Set-Location $clientDir

if ($InstallDependencies) {
    Write-Host "Instalando dependencias del cliente..."
    npm install
}

$clientProcess = Start-BackgroundProcess -WorkingDirectory $clientDir -Command $clientDevCommand -ProcessName "Cliente React"

# --- Servidor (Express) ---
Write-Host "Configurando el servidor Express..."
if (-Not (Test-Path $serverDir)) {
    Write-Host "Error: No se encontró el directorio '$serverDir'. Verifica la ruta."
    exit 1
}
Set-Location $serverDir

if ($InstallDependencies) {
    Write-Host "Instalando dependencias del servidor..."
    npm install
}

$tscProcess = Start-BackgroundProcess -WorkingDirectory $serverDir -Command $serverTranspileCommand -ProcessName "Transpilador TypeScript"

# Espera 10 segundos para asegurarse de que el servidor esté listo
Write-Host "Esperando 10 segundos para que el servidor Express esté listo..."
Start-Sleep -Seconds 10

# Inicia el servidor de desarrollo en segundo plano
Write-Host "Iniciando el servidor Express..."
$serverProcess = Start-BackgroundProcess -WorkingDirectory $serverDir -Command $serverDevCommand -ProcessName "Servidor Express"

# --- Manejo de la terminación del script ---
# Captura la señal de terminación (Ctrl+C) para detener los procesos en segundo plano
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Write-Host "Deteniendo procesos en segundo plano..."
    Stop-Process -Id $clientProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $tscProcess.Id -Force -ErrorAction SilentlyContinue
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Procesos detenidos. Saliendo del script."
}

# Mantén el script en ejecución hasta que se presione Ctrl+C
Write-Host "Presiona Ctrl+C para detener todos los procesos..."
while ($true) {
    Start-Sleep -Seconds 1
}