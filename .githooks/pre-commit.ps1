# PowerShell pre-commit hook for Windows
# This script runs before every commit to catch potential problems

$ErrorActionPreference = "Stop"

Write-Host "🔍 Running pre-commit checks..." -ForegroundColor Blue

# Check if we're in the right directory
if (-not (Test-Path "vtt-react/package.json")) {
    Write-Host "❌ Error: Must be run from project root directory" -ForegroundColor Red
    exit 1
}

# Check for common issues
Write-Host "📋 Checking for common issues..." -ForegroundColor Blue

# Check for console.log statements (warn but don't fail)
$jsFiles = git diff --cached --name-only | Where-Object { $_ -match '\.(js|jsx|ts|tsx)$' }
if ($jsFiles) {
    $consoleLogFiles = @()
    foreach ($file in $jsFiles) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            if ($content -match 'console\.log') {
                $consoleLogFiles += $file
            }
        }
    }
    if ($consoleLogFiles.Count -gt 0) {
        Write-Host "⚠️  Warning: Found console.log statements in staged files:" -ForegroundColor Yellow
        $consoleLogFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
        Write-Host "   Consider removing them before production deployment" -ForegroundColor Yellow
    }
}

# Check for TODO/FIXME comments in staged files
if ($jsFiles) {
    $todoFiles = @()
    foreach ($file in $jsFiles) {
        if (Test-Path $file) {
            $content = Get-Content $file -Raw
            if ($content -match '(TODO|FIXME|XXX)') {
                $todoFiles += $file
            }
        }
    }
    if ($todoFiles.Count -gt 0) {
        Write-Host "⚠️  Warning: Found TODO/FIXME comments in staged files:" -ForegroundColor Yellow
        $todoFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
    }
}

# Check for large files
Write-Host "📦 Checking for large files..." -ForegroundColor Blue
$stagedFiles = git diff --cached --name-only
$largeFiles = @()
foreach ($file in $stagedFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        if ($size -gt 1048576) { # 1MB
            $sizeStr = "{0:N2} MB" -f ($size / 1MB)
            $largeFiles += "$file ($sizeStr)"
        }
    }
}
if ($largeFiles.Count -gt 0) {
    Write-Host "⚠️  Warning: Large files detected:" -ForegroundColor Yellow
    $largeFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
}

# Check package.json for version consistency
Write-Host "📋 Checking package.json..." -ForegroundColor Blue
$changedFiles = git diff --cached --name-only
if ($changedFiles -contains "vtt-react/package.json") {
    Write-Host "✅ package.json changes detected" -ForegroundColor Green
}

# Test build (only if package.json or source files changed)
$buildTestFiles = $changedFiles | Where-Object { $_ -match '\.(js|jsx|ts|tsx|css|json)$' }
if ($buildTestFiles.Count -gt 0) {
    Write-Host "🏗️  Testing build process..." -ForegroundColor Blue
    
    Push-Location "vtt-react"
    try {
        # Quick build test (without full optimization)
        $buildResult = npm run build 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build failed! Please fix build errors before committing." -ForegroundColor Red
            Write-Host $buildResult -ForegroundColor Red
            exit 1
        }
        Write-Host "✅ Build test passed" -ForegroundColor Green
    }
    finally {
        Pop-Location
    }
}

# Check for merge conflict markers
Write-Host "🔍 Checking for merge conflicts..." -ForegroundColor Blue
$diffOutput = git diff --cached
if ($diffOutput -match '^(\+|\-)(<<<<<<< |======= |>>>>>>> )') {
    Write-Host "❌ Merge conflict markers found in staged files" -ForegroundColor Red
    exit 1
}

# Check git status for untracked files that might be important
$untrackedFiles = git status --porcelain | Where-Object { $_ -match '^\?\?' -and $_ -match '\.(js|jsx|css|json|md)$' }
if ($untrackedFiles.Count -gt 0) {
    Write-Host "⚠️  Warning: Untracked files that might be important:" -ForegroundColor Yellow
    $untrackedFiles | ForEach-Object { Write-Host "   $_" -ForegroundColor Yellow }
    Write-Host "   Consider adding them to git or .gitignore" -ForegroundColor Yellow
}

# Final success message
Write-Host "🎉 All pre-commit checks passed!" -ForegroundColor Green
Write-Host "📝 Commit summary:" -ForegroundColor Blue

$filesChanged = (git diff --cached --name-only | Measure-Object).Count
$linesAdded = (git diff --cached --numstat | ForEach-Object { ($_ -split '\t')[0] } | Where-Object { $_ -ne '-' } | Measure-Object -Sum).Sum
$linesRemoved = (git diff --cached --numstat | ForEach-Object { ($_ -split '\t')[1] } | Where-Object { $_ -ne '-' } | Measure-Object -Sum).Sum

Write-Host "   Files changed: $filesChanged"
Write-Host "   Lines added: $($linesAdded ?? 0)"
Write-Host "   Lines removed: $($linesRemoved ?? 0)"

exit 0
