$file = 'd:\VTT\vtt-react\src\data\classes\arcanoneerData.js'
$content = [System.IO.File]::ReadAllText($file)

# ==== FIX 1: cooldownConfig keys: type -> cooldownType, value -> cooldownValue ====
$content = $content.Replace("        type: 'turn_based',
        value:", "        cooldownType: 'turn_based',
        cooldownValue:")

$content = $content.Replace("        type: 'combat',
        value:", "        cooldownType: 'encounter',
        cooldownValue:")

# ==== FIX 2: elementType -> damageTypes (array) ====
# All the element types present
$elementMap = @{
    "elementType: 'arcane'"    = "damageTypes: ['arcane']"
    "elementType: 'force'"     = "damageTypes: ['force']"
    "elementType: 'frost'"     = "damageTypes: ['frost']"
    "elementType: 'nature'"    = "damageTypes: ['nature']"
    "elementType: 'fire'"      = "damageTypes: ['fire']"
    "elementType: 'necrotic'"  = "damageTypes: ['necrotic']"
    "elementType: 'radiant'"   = "damageTypes: ['radiant']"
    "elementType: 'chaos'"     = "damageTypes: ['chaos']"
}
foreach ($pair in $elementMap.GetEnumerator()) {
    $content = $content.Replace($pair.Key, $pair.Value)
}

# ==== FIX 3: Remove damageType: 'direct' ====
# Pattern: "        damageType: 'direct',\n"
$content = $content.Replace("        damageType: 'direct',`n", "")
# Pattern without trailing newline
$content = $content.Replace("        damageType: 'direct',
", "")
# Pattern without comma (at end of object)
$content = $content.Replace(",
        damageType: 'direct'", "")

# ==== FIX 4: Move resolution: 'DICE' from root into damageConfig/healingConfig ====
# Remove root-level resolution
$content = $content.Replace("      resolution: 'DICE',
      effectTypes:", "      effectTypes:")

$content = $content.Replace("      resolution: 'DICE',
      effectTypes:", "      effectTypes:")

# Add resolution inside damageConfig where it has damageTypes array
$content = $content.Replace("        damageTypes: ['arcane'],", "        damageTypes: ['arcane'],
        resolution: 'DICE',")
$content = $content.Replace("        damageTypes: ['force'],", "        damageTypes: ['force'],
        resolution: 'DICE',")
$content = $content.Replace("        damageTypes: ['frost'],", "        damageTypes: ['frost'],
        resolution: 'DICE',")
$content = $content.Replace("        damageTypes: ['nature'],", "        damageTypes: ['nature'],
        resolution: 'DICE',")
$content = $content.Replace("        damageTypes: ['fire'],", "        damageTypes: ['fire'],
        resolution: 'DICE',")
$content = $content.Replace("        damageTypes: ['necrotic'],", "        damageTypes: ['necrotic'],
        resolution: 'DICE',")
$content = $content.Replace("        damageTypes: ['radiant'],", "        damageTypes: ['radiant'],
        resolution: 'DICE',")
$content = $content.Replace("        damageTypes: ['chaos'],", "        damageTypes: ['chaos'],
        resolution: 'DICE',")

# Add resolution inside healingConfig
$content = $content.Replace("        healingType: 'direct',
        hasHotEffect: false", "        healingType: 'direct',
        resolution: 'DICE'")

# ==== FIX 5: Legacy DoT format ====
# hasDotEffect: true + dotFormula -> enabled + damagePerTick
$content = $content.Replace("        hasDotEffect: true,
        dotConfig: {
          duration: 2,
          tickFrequency: 'round',
          dotFormula: '1d4',
          isProgressiveDot: false,
          description: 'The ground continues to burn with magical fire, and any remaining flames continue to lick at your skin, causing ongoing burn damage as the firestorm''s effects persist.'
        },", "        dotConfig: {
          enabled: true,
          damagePerTick: '1d4',
          damageType: 'fire',
          tickFrequency: 'round',
          duration: 2,
          canStack: false,
          maxStacks: 1
        },")

$content = $content.Replace("        hasDotEffect: true,
        dotConfig: {
          duration: 2,
          tickFrequency: 'round',
          dotFormula: '1d4',
          isProgressiveDot: false
        }", "        dotConfig: {
          enabled: true,
          damagePerTick: '1d4',
          damageType: 'necrotic',
          tickFrequency: 'round',
          duration: 2,
          canStack: false,
          maxStacks: 1
        }")

$content = $content.Replace("        hasDotEffect: true,
        dotConfig: {
          duration: 3,
          tickFrequency: 'round',
          dotFormula: '2d6',
          isProgressiveDot: false
        },", "        dotConfig: {
          enabled: true,
          damagePerTick: '2d6',
          damageType: 'force',
          tickFrequency: 'round',
          duration: 3,
          canStack: false,
          maxStacks: 1
        },")

# ==== FIX 6: debuffType: 'statReduction' -> 'statPenalty' ====
$content = $content.Replace("debuffType: 'statReduction'", "debuffType: 'statPenalty'")

# ==== FIX 7: Remove secondaryElementType (incorporate into damageTypes) ====
# These will be handled individually in Phase 2 design rework

[System.IO.File]::WriteAllText($file, $content)
Write-Host "Phase 1 formatting fixes complete."

# Verify
$remaining_element = ([regex]::Matches($content, "elementType:")).Count
$remaining_direct = ([regex]::Matches($content, "damageType: 'direct'")).Count
$remaining_oldCooldown = ([regex]::Matches($content, "type: 'turn_based'")).Count
$remaining_hasDot = ([regex]::Matches($content, "hasDotEffect")).Count
$remaining_statReduction = ([regex]::Matches($content, "statReduction")).Count
$resolution_count = ([regex]::Matches($content, "resolution:")).Count
$cooldownType_count = ([regex]::Matches($content, "cooldownType:")).Count

Write-Host "  elementType remaining: $remaining_element"
Write-Host "  damageType 'direct' remaining: $remaining_direct"
Write-Host "  old cooldown type remaining: $remaining_oldCooldown"
Write-Host "  hasDotEffect remaining: $remaining_hasDot"
Write-Host "  statReduction remaining: $remaining_statReduction"
Write-Host "  resolution: total: $resolution_count"
Write-Host "  cooldownType: total: $cooldownType_count"
