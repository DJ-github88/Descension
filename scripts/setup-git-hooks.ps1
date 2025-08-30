# PowerShell script to setup git hooks on Windows
# Run this once to install pre-commit hooks

Write-Host "🔧 Setting up git hooks..." -ForegroundColor Blue

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

# Create .git/hooks directory if it doesn't exist
$hooksDir = ".git/hooks"
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
}

# Copy pre-commit hook
$sourceHook = ".githooks/pre-commit"
$targetHook = ".git/hooks/pre-commit"

if (Test-Path $sourceHook) {
    Copy-Item $sourceHook $targetHook -Force
    Write-Host "✅ Pre-commit hook installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: .githooks/pre-commit not found" -ForegroundColor Yellow
}

# Set git hooks path (optional, for team consistency)
git config core.hooksPath .githooks

Write-Host "🎉 Git hooks setup complete!" -ForegroundColor Green
Write-Host "📋 What this does:" -ForegroundColor Blue
Write-Host "   • Runs build test before each commit"
Write-Host "   • Checks for common issues (console.log, merge conflicts)"
Write-Host "   • Runs linter if available"
Write-Host "   • Warns about large files and TODOs"
Write-Host ""
Write-Host "💡 To bypass hooks (emergency only):" -ForegroundColor Blue
Write-Host "   git commit --no-verify -m `"Emergency commit`""
