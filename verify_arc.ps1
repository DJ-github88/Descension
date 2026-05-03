$content = [System.IO.File]::ReadAllText('d:\VTT\vtt-react\src\data\classes\arcanoneerData.js')

$elementType = ([regex]::Matches($content, 'elementType:')).Count
$damageTypeDirect = ([regex]::Matches($content, "damageType: 'direct'")).Count
$oldCooldown = ([regex]::Matches($content, "type: 'turn_based'")).Count
$hasDot = ([regex]::Matches($content, 'hasDotEffect')).Count
$dotFormula = ([regex]::Matches($content, 'dotFormula')).Count
$secondary = ([regex]::Matches($content, 'secondaryElementType')).Count
$statReduction = ([regex]::Matches($content, 'statReduction')).Count
$resolution = ([regex]::Matches($content, 'resolution:')).Count
$cooldownType = ([regex]::Matches($content, 'cooldownType:')).Count
$damageConfig = ([regex]::Matches($content, 'damageConfig:')).Count
$mechanicsText = ([regex]::Matches($content, 'mechanicsText:')).Count

Write-Host "=== ARCANONEER FINAL AUDIT ==="
Write-Host "elementType (legacy): $elementType (should be 0)"
Write-Host "damageType 'direct' (legacy): $damageTypeDirect (should be 0)"
Write-Host "old cooldown 'type:' (legacy): $oldCooldown (should be 0)"
Write-Host "hasDotEffect (legacy): $hasDot (should be 0)"
Write-Host "dotFormula (legacy): $dotFormula (should be 0)"
Write-Host "secondaryElementType (legacy): $secondary (should be 0)"
Write-Host "statReduction (legacy): $statReduction (should be 0)"
Write-Host "resolution: total: $resolution"
Write-Host "cooldownType: total: $cooldownType"
Write-Host "damageConfig: total: $damageConfig"
Write-Host "mechanicsText: total: $mechanicsText"

# Count spells
$spellCount = ([regex]::Matches($content, "id: 'arc_")).Count
Write-Host "Total spells: $spellCount"
