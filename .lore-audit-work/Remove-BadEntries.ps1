# Remove corrupted PowerShell-internal entries from lore.json
$ErrorActionPreference = 'Stop'

$lorePath = "D:\VTT\vtt-react\public\data\lore.json"
$backupPath = "D:\VTT\.lore-audit-work\lore.json.bak2"

# Backup
Copy-Item -LiteralPath $lorePath -Destination $backupPath -Force

$badKeys = @('SyncRoot','Count','Length','LongLength','Rank','IsReadOnly','IsFixedSize','IsSynchronized')

# Read raw text
$loreText = [System.IO.File]::ReadAllText($lorePath)

# Remove each bad entry using regex
# Entries can be: "Key": { ... }, or "Key": value,
# We need to match the key, then either a nested object or a scalar value, plus trailing comma

foreach ($badKey in $badKeys) {
    # Match: "badKey": <anything>,
    # The value could be a number (Count: 32), a boolean (IsReadOnly: true), or an object ({...})
    
    # First try to match object value: "badKey": { ... },
    # This is tricky because of nested braces. Use a simpler approach:
    # Match the key, then capture until the next top-level comma or closing brace
    
    # Pattern 1: "badKey":  number_or_word,
    $pattern1 = '"{0}":\s*[^{{}}\n]+,\s*\n' -f [regex]::Escape($badKey)
    # Pattern 2: "badKey":  number_or_word\n
    $pattern2 = '"{0}":\s*[^{{}}\n]+\n' -f [regex]::Escape($badKey)
    # Pattern 3: "badKey":  { ... },  (object - harder)
    
    # Try pattern 1 first (scalar with trailing comma)
    $before = $loreText
    $loreText = [regex]::Replace($loreText, $pattern1, '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    
    if ($loreText -ne $before) {
        Write-Host "Removed '$badKey' (scalar with comma)"
        continue
    }
    
    # Try pattern 2 (scalar at end, no trailing comma)
    $before = $loreText
    $loreText = [regex]::Replace($loreText, $pattern2, '', [System.Text.RegularExpressions.RegexOptions]::Multiline)
    
    if ($loreText -ne $before) {
        Write-Host "Removed '$badKey' (scalar, no comma)"
        continue
    }
    
    # For object values, we need a more sophisticated approach
    # Find the key, then find its matching closing brace, then remove up to and including the trailing comma
    $keyPattern = '"{0}"\s*:' -f [regex]::Escape($badKey)
    $match = [regex]::Match($loreText, $keyPattern)
    if ($match.Success) {
        Write-Host "  '$badKey' found as object, removing manually..."
        # Find the opening brace after the key
        $startIdx = $match.Index
        $colonIdx = $loreText.IndexOf(':', $startIdx)
        $braceIdx = $loreText.IndexOf('{', $colonIdx)
        
        if ($braceIdx -ge 0) {
            # Find matching closing brace
            $depth = 0
            $endIdx = $braceIdx
            for ($i = $braceIdx; $i -lt $loreText.Length; $i++) {
                if ($loreText[$i] -eq '{') { $depth++ }
                elseif ($loreText[$i] -eq '}') { 
                    $depth--
                    if ($depth -eq 0) { $endIdx = $i; break }
                }
            }
            
            # Find the line start (to remove leading whitespace/newline)
            $lineStart = $startIdx
            while ($lineStart -gt 0 -and $loreText[$lineStart-1] -ne "`n") { $lineStart-- }
            
            # Find the trailing comma after the closing brace
            $afterEnd = $endIdx + 1
            while ($afterEnd -lt $loreText.Length -and ($loreText[$afterEnd] -match '[\s,]')) { $afterEnd++ }
            
            # Remove from lineStart to afterEnd
            $loreText = $loreText.Substring(0, $lineStart) + $loreText.Substring($afterEnd)
            Write-Host "Removed '$badKey' (object)"
        }
    } else {
        Write-Host "  '$badKey' NOT FOUND"
    }
}

# Write back
[System.IO.File]::WriteAllText($lorePath, $loreText)

# Verify
Write-Host ""
Write-Host "=== Verification ==="
try {
    $verify = Get-Content -Raw -LiteralPath $lorePath | ConvertFrom-Json
    $total = ($verify.PSObject.Properties | Measure-Object).Count
    Write-Host "lore.json is valid JSON with $total entries"
    
    $stillBad = 0
    foreach ($k in $badKeys) {
        if ($verify.PSObject.Properties.Name -contains $k) { $stillBad++; Write-Host "  STILL PRESENT: $k" }
    }
    Write-Host "Remaining bad entries: $stillBad"
    
    # Verify new creature entries still present
    $sample = @('oillipheist','skreika','cycle_eater')
    foreach ($s in $sample) {
        if ($verify.PSObject.Properties.Name -contains $s) {
            Write-Host "  OK: $s still present"
        } else {
            Write-Host "  MISSING: $s"
        }
    }
} catch {
    Write-Host "ERROR: Invalid JSON after cleanup: $_" -ForegroundColor Red
    Write-Host "Restoring from backup..."
    Copy-Item -LiteralPath $backupPath -Destination $lorePath -Force
}
