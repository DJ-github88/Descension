# Clean corrupted entries from lore.json using PSCustomObject (avoids hashtable serialization issues)
$ErrorActionPreference = 'Stop'

$lorePath = "D:\VTT\vtt-react\public\data\lore.json"

# Read and parse
$lore = Get-Content -Raw -LiteralPath $lorePath | ConvertFrom-Json

$badKeys = @('SyncRoot','Count','Length','LongLength','Rank','IsReadOnly','IsFixedSize','IsSynchronized')
$allKeys = $lore.PSObject.Properties.Name
$goodKeys = $allKeys | Where-Object { $_ -notin $badKeys }

Write-Host "Total keys: $($allKeys.Count)"
Write-Host "Bad keys to remove: $($allKeys.Count - $goodKeys.Count)"
Write-Host "Good keys to keep: $($goodKeys.Count)"

# Build a NEW PSCustomObject (not hashtable) with only good properties
# PSCustomObject serializes cleanly with ConvertTo-Json
$newObj = New-Object psobject
foreach ($key in $goodKeys) {
    $newObj | Add-Member -MemberType NoteProperty -Name $key -Value $lore.$key
}

Write-Host "New object created with $(($newObj.PSObject.Properties | Measure-Object).Count) properties"

# Serialize with sufficient depth and write back
$json = $newObj | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($lorePath, $json)

# Verify
Write-Host ""
Write-Host "=== Verification ==="
$verify = Get-Content -Raw -LiteralPath $lorePath | ConvertFrom-Json
$total = ($verify.PSObject.Properties | Measure-Object).Count
Write-Host "Total entries: $total"

$stillBad = 0
foreach ($k in $badKeys) {
    if ($verify.PSObject.Properties.Name -contains $k) { $stillBad++; Write-Host "  STILL PRESENT: $k" -ForegroundColor Red }
}
Write-Host "Remaining bad keys: $stillBad"

# Check that our 32 new entries survived
$sample = @('oillipheist','grimmstalk','skreika','cycle_eater','grandmother_of_the_bog')
foreach ($s in $sample) {
    if ($verify.PSObject.Properties.Name -contains $s) {
        Write-Host "  OK: $s present"
    } else {
        Write-Host "  MISSING: $s" -ForegroundColor Red
    }
}

# Check that original entries survived
$origSample = @('gref','gambrel','stel','the_breach','sundered_monoliths','house_viridane','frostwood-reach')
foreach ($s in $origSample) {
    if ($verify.PSObject.Properties.Name -contains $s) {
        Write-Host "  OK: $s present (original)"
    } else {
        Write-Host "  MISSING: $s (original)" -ForegroundColor Red
    }
}

# Verify #11 fixes survived
if ($verify.the_breach.fullEntry -match 'false shard') {
    Write-Host "  OK: #11 fix present (the_breach has 'false shard')"
} else {
    Write-Host "  MISSING: #11 fix (the_breach missing 'false shard')" -ForegroundColor Red
}
