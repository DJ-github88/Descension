# Generate Wyrd-creature lore.json entries and merge into lore.json
$ErrorActionPreference = 'Stop'

$creaturesPath = "D:\VTT\vtt-react\public\data\creatures.json"
$lorePath = "D:\VTT\vtt-react\public\data\lore.json"

$c = Get-Content -Raw -LiteralPath $creaturesPath | ConvertFrom-Json
$loreObj = Get-Content -Raw -LiteralPath $lorePath | ConvertFrom-Json

# Build a JSON fragment of new entries (as proper JSON object, not array)
$entriesToAdd = [ordered]@{}

$c | Where-Object { $_.tags -contains 'wyrd-creature' -and -not ($loreObj.PSObject.Properties.Name -contains $_.id) } | ForEach-Object {
    $cr = $_
    $id = $cr.id
    $name = $cr.name
    $type = $cr.type
    $desc = $cr.description
    $origin = ""
    if ($cr.PSObject.Properties.Name -contains 'origin') { $origin = [string]$cr.origin }

    $region = 'frostwood-reach'
    if ($cr.tags -contains 'nordhalla') { $region = 'nordhalla' }
    elseif ($cr.tags -contains 'sundale') { $region = 'sundale' }
    elseif ($cr.tags -contains 'iceheart') { $region = 'iceheart' }
    elseif ($cr.tags -contains 'cragjaw') { $region = 'cragjaw' }
    elseif ($cr.tags -contains 'sundrift') { $region = 'sundrift-vale' }
    elseif ($cr.tags -contains 'bryngloom') { $region = 'bryngloom' }

    $loreType = 'creature'
    switch ($type) {
        'fey' { $loreType = 'fey' }
        'monstrosity' { $loreType = 'monstrosity' }
        'beast' { $loreType = 'beast' }
        'undead' { $loreType = 'undead' }
        'elemental' { $loreType = 'elemental' }
        'aberration' { $loreType = 'aberration' }
        'construct' { $loreType = 'construct' }
        'plant' { $loreType = 'plant' }
    }

    $fullEntry = $desc
    if ($origin -and $origin.Length -gt 10) {
        if (-not $fullEntry.EndsWith('.')) { $fullEntry += '.' }
        $fullEntry += "`n`n" + $origin
    }

    $summary = $desc
    if ($summary.Length -gt 200) { $summary = $summary.Substring(0, 197) + '...' }

    $related = @($region)
    if ($cr.PSObject.Properties.Name -contains 'lore') {
        foreach ($lk in $cr.lore) { $related += [string]$lk }
    }

    $entry = [ordered]@{
        term = $name
        type = $loreType
        region = $region
        summary = $summary
        fullEntry = $fullEntry
        relatedTerms = $related
    }

    $entriesToAdd[$id] = $entry
}

Write-Host ("Entries to add: {0}" -f $entriesToAdd.Count)

# Convert entriesToAdd to a JSON object (not array) with proper formatting
$newEntriesJson = $entriesToAdd | ConvertTo-Json -Depth 5

# Write to temp file
$newEntriesJson | Set-Content -LiteralPath "D:\VTT\.lore-audit-work\new_entries_obj.json"

# Show sample of the generated JSON
Write-Host "Sample of generated JSON (first 500 chars):"
Write-Host $newEntriesJson.Substring(0, [Math]::Min(500, $newEntriesJson.Length))

Write-Host ""
Write-Host "Done generating. Now merging..."
