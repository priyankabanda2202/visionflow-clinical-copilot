Set-Location (Join-Path $PSScriptRoot "web")
Write-Host ""
Write-Host "VisionFlow UI - http://localhost:3000" -ForegroundColor Cyan
Write-Host "Make sure .\start-api.ps1 is running in another terminal first." -ForegroundColor Yellow
Write-Host ""
npm install
npm run dev
