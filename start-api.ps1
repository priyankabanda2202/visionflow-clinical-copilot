Set-Location $PSScriptRoot
Write-Host ""
Write-Host "VisionFlow API - http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "Keep this window open. In another terminal run: .\start-web.ps1" -ForegroundColor Yellow
Write-Host ""
uvicorn backend.main:app --reload --port 8000
