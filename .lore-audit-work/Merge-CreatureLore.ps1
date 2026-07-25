# Merge new creature entries into lore.json via raw text manipulation
$ErrorActionPreference = 'Stop'

$lorePath = "D:\VTT\vtt-react\public\data\lore.json"
$newEntriesPath = "D:\VTT\.lore-audit-work\new_entries_obj.json"

# Backup current lore.json
Copy-Item -LiteralPath $lorePath -Destination "D:\VTT\.lore-audit-work\lore.json.bak" -Force

# Read raw text
$loreText = [System.IO.File]::ReadAllText($lorePath)
$newText = [System.IO.File]::ReadAllText($newEntriesPath)

# Validate both are parseable JSON
try { $null = $loreText | ConvertFrom-Json } catch { throw "lore.json is invalid JSON: $_" }
try { $null = $newText | ConvertFrom-Json } catch { throw "new_entries_obj.json is invalid JSON: $_" }

Write-Host "Both files are valid JSON."

# Strip outer braces and whitespace from new entries to get the inner content
# The new entries JSON is: { "key": {...}, "key2": {...} }
# We want the inner content: "key": {...}, "key2": {...}

# Find first { and last }
$firstBrace = $newText.IndexOf('{')
$lastBrace = $newText.LastIndexOf('}')
if ($firstBrace -lt 0 -or $lastBrace -lt 0) { throw "Could not find braces in new entries" }

$innerContent = $newText.Substring($firstBrace + 1, $lastBrace - $firstBrace - 1).Trim()
Write-Host "Inner content length: $($innerContent.Length) chars"

# Now lore.json is: { ...existing entries..., "lastKey": {...} }
# We need to insert a comma + new entries before the final closing brace
# Find the last } in lore.json (the file's closing brace)
$loreLastBrace = $loreText.LastIndexOf('}')
if ($loreLastBrace -lt 0) { throw "Could not find closing brace in lore.json" }

# Check what's before the closing brace - should be whitespace + maybe }
# We need to find if the content before the final } ends with a } (end of last entry) or ,
# Then insert: ,\n + new entries

# Find the position to insert (right after the last entry's closing brace, before the file's closing brace)
# The structure is: ...{...}\n}\n? 
# We insert: ,\n<new entries> right after the last entry's closing brace

# Get the substring before the file's closing brace
$beforeClose = $loreText.Substring(0, $loreLastBrace).TrimEnd()
Write-Host "Content before closing brace ends with: '$($beforeClose.Substring([Math]::Max(0,$beforeClose.Length-10)))'"

# Verify it ends with }
if (-not $beforeClose.EndsWith('}')) {
    Write-Host "WARNING: content before final brace does not end with } - unexpected format"
}

# Insert comma + new entries between the last entry's } and the file's }
$insertPoint = $beforeClose.Length
$newLoreText = $beforeClose + ",`n" + $innerContent + "`n}`n"

# Write back
[System.IO.File]::WriteAllText($lorePath, $newLoreText)

Write-Host "lore.json updated via raw text merge."

# Verify the result is valid JSON
try {
    $verify = Get-Content -Raw -LiteralPath $lorePath | ConvertFrom-Json
    $totalCount = ($verify.PSObject.Properties | Measure-Object).Count
    Write-Host "Verification: lore.json is valid JSON with $totalCount total entries"
    
    # Check specific entries
    $checks = @('oillipheist','grimmstalk','pooka','skerry','nachtkrapp','glacier_gremlin','aswad','pelagos','egbere','gaki','kamaitachi','tengu_scout','mogwai','yalbagan','qilin','vodyan','the_revel','skreika','rimor','the_cinder','ash_woven_oracle','husque','spume_of_the_drowned','writ_of_passage','storm_crows','sump_scrabs','lien','hungry_child_creature','sere_khan','grandmother_of_the_bog','debt_revenant','cycle_eater')
    $found = 0
    foreach ($id in $checks) {
        if ($verify.PSObject.Properties.Name -contains $id) { $found++ }
    }
    Write-Host "Verification: $found of $($checks.Count) new entries found in lore.json"
} catch {
    Write-Host "ERROR: Resulting lore.json is INVALID JSON: $_" -ForegroundColor Red
    Write-Host "Restoring from backup..."
    Copy-Item -LiteralPath "D:\VTT\.lore-audit-work\lore.json.bak" -Destination $lorePath -Force
    Write-Host "Backup restored."
}
