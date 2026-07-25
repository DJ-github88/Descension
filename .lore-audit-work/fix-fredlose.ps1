# Replace ASCII 'Fredlose' with proper Old Danish 'Fredloese' (escape form for JSON, raw for MD)
$ErrorActionPreference = 'Stop'

# --- lore.json (use \u00F8 escape for consistency with existing mojibake-fixed entries) ---
$lorePath = 'D:\VTT\vtt-react\public\data\lore.json'
$loreTxt = [System.IO.File]::ReadAllText($lorePath)
$loreBefore = ([regex]::Matches($loreTxt, 'Fredlose')).Count
Write-Host ('lore.json before: ' + $loreBefore + ' ASCII instances')
$loreTxt = $loreTxt.Replace('Fredlose', 'Fredl\u00F8se')
$loreAfter = ([regex]::Matches($loreTxt, 'Fredlose')).Count
$loreEsc = ([regex]::Matches($loreTxt, [regex]::Escape('Fredl\u00F8se'))).Count
Write-Host ('lore.json after:  ' + $loreAfter + ' ASCII, ' + $loreEsc + ' escape-form (was 1 before + 9 fixed = 10 expected)')

$loreTemp = $lorePath + '.fredlose-tmp'
[System.IO.File]::WriteAllText($loreTemp, $loreTxt)
Write-Host ('Wrote temp: ' + $loreTemp)

# Validate
try {
    $parsed = Get-Content -Raw -LiteralPath $loreTemp | ConvertFrom-Json
    $count = ($parsed.PSObject.Properties | Measure-Object).Count
    Write-Host ('  Parse OK. Entries: ' + $count + ' (expect 314)')
    if ($count -ne 314) { throw 'Entry count mismatch' }
    # Spot check: the_fredlose.term should now render as 'The Fredl' + U+00F8 + 'se'
    $expected = 'The Fredl' + [char]0x00F8 + 'se'
    $actual = $parsed.'the_fredlose'.term
    Write-Host ('  the_fredlose.term: ' + $actual)
    if ($actual -ne $expected) { throw 'Term mismatch' }
    Write-Host ('  the_fredlose.fullEntry contains Fredl+U+00F8+se: ' + $parsed.'the_fredlose'.fullEntry.Contains('Fredl' + [char]0x00F8 + 'se'))
    Write-Host ('  halvar-skalvyr.fullEntry contains Fredl+U+00F8+se: ' + $parsed.'halvar-skalvyr'.fullEntry.Contains('Fredl' + [char]0x00F8 + 'se'))
    # No PS internal leaks
    $badKeys = @('SyncRoot','Count','Length','LongLength','Rank','IsReadOnly','IsFixedSize','IsSynchronized')
    $leaks = $badKeys | Where-Object { $parsed.PSObject.Properties.Name -contains $_ }
    if ($leaks) { throw 'PS leak: ' + $leaks } else { Write-Host '  No PS leaks' }
} catch {
    Write-Host ('  JSON INVALID: ' + $_)
    Write-Host ('  Temp KEPT: ' + $loreTemp)
    throw
}

Move-Item -LiteralPath $loreTemp -Destination $lorePath -Force
Write-Host ('lore.json replaced. MD5: ' + (Get-FileHash -LiteralPath $lorePath -Algorithm MD5).Hash)

# --- LORE_STYLE_GUIDE.md (use raw  for markdown) ---
$mdPath = 'D:\VTT\LORE_STYLE_GUIDE.md'
$mdTxt = [System.IO.File]::ReadAllText($mdPath)
$mdBefore = ([regex]::Matches($mdTxt, 'Fredlose')).Count
Write-Host ''
Write-Host ('LORE_STYLE_GUIDE.md before: ' + $mdBefore + ' ASCII instances')
$slashO = [char]0x00F8
$mdTxt = $mdTxt.Replace('Fredlose', ('Fredl' + $slashO + 'se'))
$mdAfter = ([regex]::Matches($mdTxt, 'Fredlose')).Count
Write-Host ('LORE_STYLE_GUIDE.md after:  ' + $mdAfter + ' ASCII')
[System.IO.File]::WriteAllText($mdPath, $mdTxt)
Write-Host ('LORE_STYLE_GUIDE.md updated. MD5: ' + (Get-FileHash -LiteralPath $mdPath -Algorithm MD5).Hash)

Write-Host ''
Write-Host '=== DONE ==='
