# PowerShell script to test observability features
# Usage: .\scripts\test-observability.ps1

Write-Host "🧪 Testing Observability Features" -ForegroundColor Cyan
Write-Host ""

$SERVER_URL = if ($env:SERVER_URL) { $env:SERVER_URL } else { "http://localhost:3001" }

# Test 1: Health endpoint
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$SERVER_URL/health" -Method Get -ErrorAction Stop
    if ($health.status -eq "OK") {
        Write-Host "   ✅ Health endpoint working" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Health endpoint returned unexpected status" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Metrics endpoint
Write-Host "2. Testing Metrics Endpoint..." -ForegroundColor Yellow
try {
    $metrics = Invoke-RestMethod -Uri "$SERVER_URL/metrics" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Metrics endpoint working" -ForegroundColor Green
    Write-Host "   📊 Current Metrics:" -ForegroundColor Cyan
    Write-Host "      Rooms: $($metrics.rooms.total) total, $($metrics.rooms.active) active"
    Write-Host "      Players: $($metrics.players.total)"
    Write-Host "      Active Requests: $($metrics.performance.activeRequests)"
    if ($metrics.errors) {
        Write-Host "      Recent Errors: $($metrics.errors.total)"
    }
} catch {
    Write-Host "   ❌ Metrics endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Logs endpoint
Write-Host "3. Testing Logs Endpoint..." -ForegroundColor Yellow
try {
    $logs = Invoke-RestMethod -Uri "$SERVER_URL/debug/logs?limit=5" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Logs endpoint working" -ForegroundColor Green
    Write-Host "   Found $($logs.count) recent log entries"
} catch {
    Write-Host "   ❌ Logs endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check log files exist
Write-Host "4. Checking Log Files..." -ForegroundColor Yellow
$logsDir = "server\logs"
if (Test-Path $logsDir) {
    $logFiles = Get-ChildItem -Path $logsDir -Filter "*.log" -ErrorAction SilentlyContinue
    if ($logFiles) {
        Write-Host "   ✅ Log files directory exists" -ForegroundColor Green
        $latestLog = $logFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        $lineCount = (Get-Content $latestLog.FullName | Measure-Object -Line).Lines
        Write-Host "   Latest log file: $($latestLog.Name)"
        Write-Host "   Log entries: $lineCount"
    } else {
        Write-Host "   ⚠️  Log files directory exists but no log files found" -ForegroundColor Yellow
        Write-Host "   (This is OK if server just started)"
    }
} else {
    Write-Host "   ⚠️  Log files directory not found" -ForegroundColor Yellow
    Write-Host "   (This is OK if server just started)"
}
Write-Host ""

# Test 5: Generate some test activity
Write-Host "5. Generating Test Activity..." -ForegroundColor Yellow
for ($i = 1; $i -le 5; $i++) {
    try {
        Invoke-RestMethod -Uri "$SERVER_URL/health" -Method Get -ErrorAction SilentlyContinue | Out-Null
    } catch {
        # Ignore errors for test requests
    }
}
Write-Host "   ✅ Generated 5 test requests" -ForegroundColor Green
Write-Host "   Check logs to see if they were recorded"
Write-Host ""

Write-Host "✅ Observability Test Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check server\logs\ for log files"
Write-Host "  2. Query /debug/logs endpoint to see recent logs"
Write-Host "  3. Monitor /metrics endpoint for system stats"

