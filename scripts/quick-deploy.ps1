# Quick Deploy to Netlify - PowerShell Script
param(
    [string]$commitMessage = "Quick multiplayer fix"
)

Write-Host "🚀 Starting quick Netlify deployment..." -ForegroundColor Green

# Change to project root
Set-Location $PSScriptRoot\..

# Add all changes
Write-Host "📝 Adding all changes..." -ForegroundColor Yellow
git add .

# Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$fullMessage = "$commitMessage - $timestamp"
Write-Host "💾 Committing: $fullMessage" -ForegroundColor Yellow
git commit -m $fullMessage

# Push to master
Write-Host "⬆️  Pushing to master..." -ForegroundColor Yellow
git push origin master

# Build locally for faster deployment
Write-Host "🏗️  Building application..." -ForegroundColor Yellow
Set-Location vtt-react
npm run build:netlify

# Check if build succeeded
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green

    # Show deployment instructions
    Write-Host "`n🎯 DEPLOYMENT READY!" -ForegroundColor Green
    Write-Host "Go to https://app.netlify.com/sites/windtunnel/deploys" -ForegroundColor Cyan
    Write-Host "Click 'Trigger deploy' -> 'Deploy site'" -ForegroundColor Cyan
    Write-Host "`nOr drag the 'build' folder to Netlify dashboard for instant deploy" -ForegroundColor Cyan

    # Show the build folder location
    $buildPath = Join-Path (Get-Location) "build"
    Write-Host "`nBuild folder: $buildPath" -ForegroundColor White
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n⏱️  Total time: $([math]::Round((Get-Date).Subtract((Get-Date).AddMinutes(-1)).TotalSeconds, 1))s" -ForegroundColor Gray
