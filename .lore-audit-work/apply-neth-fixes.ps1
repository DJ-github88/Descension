# Fix remaining Neth subrace display name inconsistencies
$ErrorActionPreference = 'Stop'
$path = 'D:\VTT\vtt-react\public\data\lore.json'
$tempPath = $path + '.nethfix-tmp'
$txt = [System.IO.File]::ReadAllText($path)

function ConvertTo-JsonEscaped {
    param([string]$s)
    $s = $s -replace '\\', '\\'
    $s = $s -replace '"', '\"'
    $s = $s -replace "'", '\u0027'
    $emDash = [char]0x2014
    $s = $s -replace [regex]::Escape($emDash), '\u2014'
    $s = $s -replace "`r`n", '\n'
    $s = $s -replace "`n", '\n'
    return $s
}

function Replace-Once {
    param([string]$label, [ref]$txtRef, [string]$old, [string]$new)
    $count = ([regex]::Matches($txtRef.Value, [regex]::Escape($old))).Count
    if ($count -eq 0) { Write-Host ('  [SKIP-not-found] ' + $label); return $false }
    if ($count -gt 1) { throw ('MULTIPLE [' + $label + ']: ' + $count) }
    $txtRef.Value = $txtRef.Value.Replace($old, $new)
    Write-Host ('  [OK] ' + $label)
    return $true
}

# Remaining fixes:
# 1. Paragraph 1: "The Drun burned their names" -> "The Pale Neth (the Drun) burned their names"
# 2. Paragraph 2: "the pale-skinned Velun pact-lords who govern the canopy, the Kessen weavers"
#    -> "the pale-skinned High Neth (Velun) pact-lords who govern the canopy, the Hallowed Neth (Kessen) weavers"
# 3. Paragraph 3: "memory-glass that Kessen weavers harvest" -> "memory-glass that Hallowed Neth (Kessen) weavers harvest"

$emDash = [char]0x2014

$fix1Old = "The Drun burned their names from the Contract entirely"
$fix1New = "The Pale Neth (the Drun) burned their names from the Contract entirely"
Replace-Once 'neth.para1 Drun' ([ref]$txt) (ConvertTo-JsonEscaped $fix1Old) (ConvertTo-JsonEscaped $fix1New) | Out-Null

$fix2Old = "the pale-skinned Velun pact-lords who govern the canopy, the Kessen weavers who work the forest floor"
$fix2New = "the pale-skinned High Neth (Velun) pact-lords who govern the canopy, the Hallowed Neth (Kessen) weavers who work the forest floor"
Replace-Once 'neth.para2 Velun+Kessen' ([ref]$txt) (ConvertTo-JsonEscaped $fix2Old) (ConvertTo-JsonEscaped $fix2New) | Out-Null

$fix3Old = "memory-glass that Kessen weavers harvest"
$fix3New = "memory-glass that Hallowed Neth (Kessen) weavers harvest"
Replace-Once 'neth.para3 Kessen weavers' ([ref]$txt) (ConvertTo-JsonEscaped $fix3Old) (ConvertTo-JsonEscaped $fix3New) | Out-Null

[System.IO.File]::WriteAllText($tempPath, $txt)
try {
    $parsed = Get-Content -Raw -LiteralPath $tempPath | ConvertFrom-Json
    $count = ($parsed.PSObject.Properties | Measure-Object).Count
    Write-Host ('Parse OK. Entries: ' + $count)
    Write-Host ('  neth.fullEntry has "Pale Neth (the Drun) burned": ' + $parsed.neth.fullEntry.Contains('Pale Neth (the Drun) burned'))
    Write-Host ('  neth.fullEntry has "High Neth (Velun) pact-lords": ' + $parsed.neth.fullEntry.Contains('High Neth (Velun) pact-lords'))
    Write-Host ('  neth.fullEntry has "Hallowed Neth (Kessen) weavers who work": ' + $parsed.neth.fullEntry.Contains('Hallowed Neth (Kessen) weavers who work'))
    Write-Host ('  neth.fullEntry has "Hallowed Neth (Kessen) weavers harvest": ' + $parsed.neth.fullEntry.Contains('Hallowed Neth (Kessen) weavers harvest'))
} catch {
    Write-Host ('INVALID: ' + $_)
    Write-Host ('Temp KEPT: ' + $tempPath)
    throw
}
Move-Item -LiteralPath $tempPath -Destination $path -Force
Write-Host ('MD5: ' + (Get-FileHash -LiteralPath $path -Algorithm MD5).Hash)
