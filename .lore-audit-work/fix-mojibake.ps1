# Fix em-dash + accented-char mojibake in lore.json.
# Replaces corrupted byte-sequences with safe \u escape sequences (pure ASCII output).
# Atomic write via temp file + validation.

$ErrorActionPreference = 'Stop'
$path = "D:\VTT\vtt-react\public\data\lore.json"
$tempPath = "$path.mojibake-tmp"
$txt = [System.IO.File]::ReadAllText($path)

# Build search/replace strings using [char] codes (script source stays pure ASCII)
$emDashBad  = ([char]0x00E2).ToString() + ([char]0x20AC).ToString() + ([char]0x201D).ToString()
$emDashGood = '\u2014'

$acuteEBad  = ([char]0x00C3).ToString() + ([char]0x00A9).ToString()
$acuteEGood = '\u00E9'

$slashOBad  = ([char]0x00C3).ToString() + ([char]0x00B8).ToString()
$slashOGood = '\u00F8'

# Count occurrences before
$emBefore   = ([regex]::Matches($txt, [regex]::Escape($emDashBad))).Count
$acuteBefore = ([regex]::Matches($txt, [regex]::Escape($acuteEBad))).Count
$slashBefore = ([regex]::Matches($txt, [regex]::Escape($slashOBad))).Count

Write-Host "=== BEFORE ==="
Write-Host "  em-dash mojibake (U+00E2 U+20AC U+201D): $emBefore"
Write-Host "  e-acute mojibake (U+00C3 U+00A9):       $acuteBefore"
Write-Host "  o-slash mojibake (U+00C3 U+00B8):       $slashBefore"
$totalBefore = $emBefore + $acuteBefore + $slashBefore
Write-Host "  TOTAL: $totalBefore"

# Apply replacements (all occurrences)
$txt = $txt.Replace($emDashBad, $emDashGood)
$txt = $txt.Replace($acuteEBad, $acuteEGood)
$txt = $txt.Replace($slashOBad, $slashOGood)

# Count after (should all be 0)
$emAfter    = ([regex]::Matches($txt, [regex]::Escape($emDashBad))).Count
$acuteAfter = ([regex]::Matches($txt, [regex]::Escape($acuteEBad))).Count
$slashAfter = ([regex]::Matches($txt, [regex]::Escape($slashOBad))).Count
Write-Host ""
Write-Host "=== AFTER ==="
Write-Host "  em-dash mojibake: $emAfter (expect 0)"
Write-Host "  e-acute mojibake: $acuteAfter (expect 0)"
Write-Host "  o-slash mojibake: $slashAfter (expect 0)"

# Sanity: count \u escapes in the file (should be increased)
$escCount = ([regex]::Matches($txt, '\\u2014')).Count
$acuteEscCount = ([regex]::Matches($txt, '\\u00E9')).Count
$slashEscCount = ([regex]::Matches($txt, '\\u00F8')).Count
Write-Host ""
Write-Host "=== ESCAPE SEQUENCES NOW PRESENT ==="
Write-Host "  \u2014 (em-dash): $escCount"
Write-Host "  \u00E9 (e-acute): $acuteEscCount"
Write-Host "  \u00F8 (o-slash): $slashEscCount"

# Write to temp
[System.IO.File]::WriteAllText($tempPath, $txt)
Write-Host ""
Write-Host "Wrote temp: $tempPath ($((Get-Item $tempPath).Length) bytes)"

# Validate temp file
Write-Host ""
Write-Host "=== VALIDATE ==="
try {
    $parsed = Get-Content -Raw -LiteralPath $tempPath | ConvertFrom-Json
    $count = ($parsed.PSObject.Properties | Measure-Object).Count
    Write-Host "  Parse OK. Entries: $count (expect 314)"
    if ($count -ne 316) { throw "Entry count mismatch: $count" }
    # Spot-check that fixed text renders correctly
    Write-Host ""
    Write-Host "=== SPOT CHECKS (parsed text) ==="
    Write-Host "  house_viridane.fullEntry contains em-dash char (U+2014): $($parsed.house_viridane.fullEntry.Contains([char]0x2014))"
    Write-Host "  house_viridane.fullEntry still contains 'cleansing key': $($parsed.house_viridane.fullEntry.Contains('cleansing key'))"
    Write-Host "  house_skalvyr.fullEntry contains 'Fredl' + o-slash + 'se': $($parsed.house_skalvyr.fullEntry.Contains('Fredl' + [char]0x00F8 + 'se'))"
    Write-Host "  cult_of_the_silent_dark.fullEntry contains 'corv' + e-acute + 'e': $($parsed.cult_of_the_silent_dark.fullEntry.Contains('corv' + [char]0x00E9 + 'e'))"
    # Check PS internal property leaks
    $badKeys = @('SyncRoot','Count','Length','LongLength','Rank','IsReadOnly','IsFixedSize','IsSynchronized')
    $leaks = $badKeys | Where-Object { $parsed.PSObject.Properties.Name -contains $_ }
    if ($leaks) { throw "PS internal property leak: $leaks" } else { Write-Host "  No PS internal property leaks" }
} catch {
    Write-Host "  JSON INVALID: $_"
    Write-Host "  Temp KEPT for inspection: $tempPath"
    throw
}

# Atomic replace
Write-Host ""
Write-Host "=== ATOMIC REPLACE ==="
Move-Item -LiteralPath $tempPath -Destination $path -Force
Write-Host "Replaced. Final size: $((Get-Item $path).Length) bytes"
Write-Host "Final MD5: $((Get-FileHash -LiteralPath $path -Algorithm MD5).Hash)"
Write-Host ""
Write-Host "=== DONE ==="
