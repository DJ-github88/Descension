# Replace ASCII 'Fredlose' with proper Old Danish 'Fredl' + o-slash in source/audit files.
# v3: validates .js via stdin node --check (no file-path resolution issues)

$ErrorActionPreference = 'Stop'
$slashO = [char]0x00F8
$properRaw = 'Fredl' + $slashO + 'se'

$files = @(
    'D:\VTT\vtt-react\src\data\backgroundData.js',
    'D:\VTT\vtt-react\src\data\classes\classDisplayData.js',
    'D:\VTT\.lore-audit-work\0_MASTER_LORE_MAP_AND_AUDIT.md',
    'D:\VTT\.lore-audit-work\11_BACKGROUNDS_MISC.md',
    'D:\VTT\.lore-audit-work\1_COSMOLOGY.md',
    'D:\VTT\.lore-audit-work\CANON_REFERENCE.md',
    'D:\VTT\.lore-audit-work\CONTINUE_PROMPT.md'
)

$totalFixed = 0
foreach ($p in $files) {
    if (-not (Test-Path -LiteralPath $p)) {
        Write-Host ('SKIP (not found): ' + $p)
        continue
    }
    $txt = [System.IO.File]::ReadAllText($p)
    $before = ([regex]::Matches($txt, 'Fredlose')).Count
    if ($before -eq 0) {
        Write-Host ('SKIP (no instances): ' + $p)
        continue
    }
    $modified = $txt.Replace('Fredlose', $properRaw)
    $after = ([regex]::Matches($modified, 'Fredlose')).Count

    # For .js files: validate via stdin node --check --input-type=module
    if ($p -like '*.js') {
        $tmpFile = 'D:\VTT\.lore-audit-work\fredlose-stdin-check.txt'
        [System.IO.File]::WriteAllText($tmpFile, $modified)
        $checkResult = Get-Content -Raw -LiteralPath $tmpFile | node --check --input-type=module 2>&1
        Remove-Item -LiteralPath $tmpFile -Force -ErrorAction SilentlyContinue
        if ($checkResult) {
            # node --check produces NO output on success; any output = error
            throw ('JS syntax FAILED for ' + $p + ': ' + ($checkResult -join ' '))
        }
        Write-Host '  JS syntax OK (stdin check)'
    }

    [System.IO.File]::WriteAllText($p, $modified)
    Write-Host ('FIXED ' + $before + ' -> ' + $after + ' : ' + $p)
    $totalFixed += $before
}

Write-Host ''
Write-Host ('=== TOTAL FIXED: ' + $totalFixed + ' instances ===')
