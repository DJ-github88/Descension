# Canon batch: apply user-confirmed direction on 6 remaining items.
$ErrorActionPreference = 'Stop'
$path = 'D:\VTT\vtt-react\public\data\lore.json'
$tempPath = $path + '.canon-tmp'
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
    if ($count -ne 1) { throw ('UNIQUENESS FAILED [' + $label + ']: ' + $count) }
    $txtRef.Value = $txtRef.Value.Replace($old, $new)
    Write-Host ('  [OK] ' + $label)
}

Write-Host '=== TASK 1: Myrathil summary fix (Shore/Deep/Brook -> Shoreling/Deepling/Riverling) ==='
Replace-Once 'myrathil.summary' ([ref]$txt) `
    'divided into the shore-dwelling Shore, the abyssal Deep, and the inland Brook.' `
    'divided into the shore-dwelling Shoreling, the abyssal Deepling, and the inland Riverling.'

Write-Host ''
Write-Host '=== TASK 2: Mimir lore.json rewrite (Masked/Woven/Unwoven -> Arch/Broken Mimir; drop Unwoven) ==='
# The lore.json mimir.fullEntry has 3 paragraphs. Rewrite paragraph 2 (which names the 3 groups).
$mimOldPara2 = 'The Masked rule the canopy-holds as aristocrats. The Woven keep watch from the high aeries, maintaining a living mask-craft tradition through storm-glass forging. The Unwoven, born without masks or the ability to shapeshift, drift the valley floor carrying cracked heirlooms no one remembers how to repair.'
$mimNewPara2 = 'The Arch Mimir rule the canopy-holds as aristocrats, their heartwood masks carved in the old way, each one a fixed identity that holds the bearer together through the fog. The Broken Mimir keep watch from the high aeries, maintaining a living mask-craft tradition through storm-glass forging, their masks cracked and re-forged so many times that the face beneath has long since been lost. Between the two subraces, Mirror Mere still lies at the heart of Arch territory, a lake so still it returns a Mimir\u0027s true face even when they can no longer recall it.'
# Note: above embeds \u0027 escape literally (6 chars in source); ConvertTo-JsonEscaped will then escape the actual apostrophe char if any. We want the LITERAL \u0027 to appear in the file.
# Simpler: build with actual apostrophe and let ConvertTo-JsonEscaped handle it.
$mimNewPara2Actual = "The Arch Mimir rule the canopy-holds as aristocrats, their heartwood masks carved in the old way, each one a fixed identity that holds the bearer together through the fog. The Broken Mimir keep watch from the high aeries, maintaining a living mask-craft tradition through storm-glass forging, their masks cracked and re-forged so many times that the face beneath has long since been lost. Between the two subraces, Mirror Mere still lies at the heart of Arch territory, a lake so still it returns a Mimir's true face even when they can no longer recall it."

# Find paragraph 2 in FILE form (it has \u0027 for apostrophes already)
$mimOldFileForm = ConvertTo-JsonEscaped $mimOldPara2
$mimNewFileForm = ConvertTo-JsonEscaped $mimNewPara2Actual
$occ = ([regex]::Matches($txt, [regex]::Escape($mimOldFileForm))).Count
if ($occ -ne 1) { throw ('Mimir paragraph 2 uniqueness: ' + $occ) }
$txt = $txt.Replace($mimOldFileForm, $mimNewFileForm)
Write-Host '  [OK] mimir.fullEntry paragraph 2 rewritten (Masked/Woven/Unwoven -> Arch/Broken)'

Write-Host ''
Write-Host '=== TASK 3: Mimir summary (mentions 3 groups via implied structure) — keep summary as is (no group count) ==='
Write-Host '  [SKIP] summary already does not enumerate subraces'

Write-Host ''
Write-Host '=== TASK 4: Neth summary (use High/Hallowed/Pale Neth descriptors) ==='
$nethOldSum = 'A people bound by iron contracts to the forest entity that gave them immortality - the Velun carry the pact\u0027s authority, while the Kessen and Drun walk different paths.'
$nethNewSum = 'A people bound by iron contracts to the forest entity that gave them immortality - the High Neth (Velun) carry the pact\u0027s authority, while the Hallowed Neth (Kessen) and the Pale Neth (Drun) walk different paths.'
# Note: above has \u0027 literally as 6 chars. Build properly.
$nethOldSumActual = "A people bound by iron contracts to the forest entity that gave them immortality - the Velun carry the pact's authority, while the Kessen and Drun walk different paths."
$nethNewSumActual = "A people bound by iron contracts to the forest entity that gave them immortality - the High Neth (Velun) carry the pact's authority, while the Hallowed Neth (Kessen) and the Pale Neth (Drun) walk different paths."
# Note: actual file uses em-dash (U+2014) not ASCII hyphen. ConvertTo-JsonEscaped handles that.
# Build using actual em-dash char to match file:
$emDash = [char]0x2014
$nethOldSumActual = $nethOldSumActual -replace ' - ', (' ' + $emDash + ' ')
$nethNewSumActual = $nethNewSumActual -replace ' - ', (' ' + $emDash + ' ')
Replace-Once 'neth.summary' ([ref]$txt) (ConvertTo-JsonEscaped $nethOldSumActual) (ConvertTo-JsonEscaped $nethNewSumActual)

Write-Host ''
Write-Host '=== TASK 5: Neth fullEntry (use High/Hallowed/Pale Neth descriptors with proper-noun parentheticals) ==='
# The current fullEntry uses Velun/Kessen/Drun throughout. Replace with descriptive titles + parentheticals.
# Find each occurrence in the fullEntry and update.
$nethReplacements = @(
    @{ Old = 'The Velun, bound most directly to the pact, speak with Morvane\u0027s authority'; New = 'The High Neth (the Velun), bound most directly to the pact, speak with Morvane\u0027s authority' },
    @{ Old = 'The Kessen perceive the obligation-web'; New = 'The Hallowed Neth (the Kessen) perceive the obligation-web' },
    @{ Old = 'the leaden-grey Drun, outcasts who burned'; New = 'the leaden-grey Pale Neth (the Drun), outcasts who burned' },
    @{ Old = 'the pale-skinned Velun pact-lords who govern the canopy, the Kessen weavers who work the forest floor, and the leaden-grey Drun'; New = 'the pale-skinned High Neth (Velun) pact-lords who govern the canopy, the Hallowed Neth (Kessen) weavers who work the forest floor, and the leaden-grey Pale Neth (Drun)' }
)
foreach ($r in $nethReplacements) {
    $oldActual = $r.Old -replace '\\u0027', "'"
    $newActual = $r.New -replace '\\u0027', "'"
    $oldFileForm = ConvertTo-JsonEscaped $oldActual
    $newFileForm = ConvertTo-JsonEscaped $newActual
    $occ = ([regex]::Matches($txt, [regex]::Escape($oldFileForm))).Count
    if ($occ -eq 0) {
        Write-Host ('  [SKIP] not found: ' + $r.Old.Substring(0, [Math]::Min(60, $r.Old.Length)))
        continue
    }
    if ($occ -gt 1) { throw ('Multiple matches for: ' + $r.Old) }
    $txt = $txt.Replace($oldFileForm, $newFileForm)
    Write-Host ('  [OK] neth.fullEntry: ' + $r.Old.Substring(0, [Math]::Min(40, $r.Old.Length)) + '...')
}

Write-Host ''
Write-Host '=== TASK 6: Subrace migration: change velun/merryn/rime_born type=race -> type=subrace ==='
foreach ($key in @('velun','merryn','rime_born')) {
    # Find the entry's type field
    $pattern = '(?m)^\s*"' + [regex]::Escape($key) + '":\s*\{'
    $entryMatch = [regex]::Match($txt, $pattern)
    if (-not $entryMatch.Success) { Write-Host ('  [SKIP] not found: ' + $key); continue }
    $entryIdx = $entryMatch.Index
    $typeIdx = $txt.IndexOf('"type":', $entryIdx)
    # Find the next 200 chars after "type": to confirm we have the right one
    $afterType = $txt.Substring($typeIdx, [Math]::Min(50, $txt.Length - $typeIdx))
    if ($afterType -notmatch '"type":\s*"race"') {
        Write-Host ('  [SKIP] not type=race: ' + $key + ' (got: ' + $afterType.Substring(0, 30) + '...)')
        continue
    }
    # Replace "type":  "race" with "type":  "subrace" at this specific position
    # Find the exact string to replace (preserving whitespace)
    $typeEnd = $txt.IndexOf('"race"', $typeIdx)
    $replaceStart = $typeEnd
    $replaceEnd = $typeEnd + 6  # length of "race"
    $txt = $txt.Substring(0, $replaceStart) + '"subrace"' + $txt.Substring($replaceEnd)
    Write-Host ('  [OK] ' + $key + ': type=race -> type=subrace')
}

Write-Host ''
Write-Host '=== TASK 7: Human top-level entry — add new entry at end ==='
$humanEntryJson = @'
    "human":  {
                  "id":  "human",
                  "term":  "Human",
                  "type":  "race",
                  "region":  "atropolis",
                  "summary":  "The shortest-lived people of Mythrill, whose seven noble houses struck the bargains that bound Sol and broke the world, and whose regional subraces still carry the consequences of those bargains in blood and climate.",
                  "fullEntry":  "The humans were already on Mythrill when Sol entered its Deepening, and they were the ones who answered. Seven noble houses went to the Warden: Thalreth, Skalvyr, Tesshan, Solvan, Mereval, Ordavan, Viridane. Six of them broke. The seventh refused. The Bargains that came of that meeting, and the Breach that followed, remade the world and remade the humans who lived in it.\n\nThe seven regional subraces of humanity still carry the Bargains in their blood. The Thalren of the Frostwood Reach trade clarity for insulating fog. The Skald of Nordhalla traded summer for halted glaciers. The Tessen of the Cragjaw Peaks traded visibility for eternal blizzard-veil. The Solvarn of Sundale wielded the knife that flayed Aex and bear the guilt. The Merryn of the Iceheart Sea traded calm waters for perpetual storms. The Ordavan of Sundrift Vale traded fertile soil for endless grass and a sky the constellations flee. The Morren of the Bryngloom Forest walk the bog under the Neth First Contract. Each subrace is human; each subrace is what their bargain made them.\n\nHumans are the shortest-lived people of Mythrill, the most prolific, and the ones whose ancestors decided the shape of the world. They do not get to forget it. Every human carries a house-name in their lineage, and every house-name carries a bargain, and every bargain is still being paid.",
                  "relatedTerms":  [
                                       "thalren",
                                       "skald",
                                       "tessen",
                                       "solvarn",
                                       "merryn",
                                       "ordan",
                                       "morren",
                                       "house_thalreth",
                                       "house_skalvyr",
                                       "house_tesshan",
                                       "house_solvan",
                                       "house_mereval",
                                       "house_ordavan",
                                       "house_viridane",
                                       "the_breach",
                                       "the_warden",
                                       "aex"
                                  ]
              }
'@

# Insert before final root close
$rootPattern = '(?s)\r?\n\s*\}\r?\n\s*\}\s*$'
$rootMatch = [regex]::Match($txt, $rootPattern)
if (-not $rootMatch.Success) { throw ('Root-close pattern not found') }
$matchVal = $rootMatch.Value
$firstBrace = $matchVal.IndexOf('}')
$lastBrace = $matchVal.LastIndexOf('}')
$beforeFirst = $matchVal.Substring(0, $firstBrace + 1)
$between = $matchVal.Substring($firstBrace + 1, $lastBrace - $firstBrace - 1)
$afterLast = $matchVal.Substring($lastBrace)
$replacement = $beforeFirst + "," + $between + $humanEntryJson + $between + $afterLast
$txt = $txt.Remove($rootMatch.Index, $rootMatch.Length).Insert($rootMatch.Index, $replacement)
Write-Host '  [OK] human entry inserted (id=human, type=race)'

Write-Host ''
Write-Host '=== WRITE TEMP + VALIDATE ==='
[System.IO.File]::WriteAllText($tempPath, $txt)
try {
    $parsed = Get-Content -Raw -LiteralPath $tempPath | ConvertFrom-Json
    $count = ($parsed.PSObject.Properties | Measure-Object).Count
    Write-Host ('Parse OK. Entries: ' + $count + ' (expect 315 = 314 + human)')
    if ($count -ne 315) { throw ('count mismatch') }
    # Spot checks
    Write-Host ('  myrathil.summary has Shoreling: ' + $parsed.myrathil.summary.Contains('Shoreling'))
    Write-Host ('  mimir.fullEntry has Arch Mimir: ' + $parsed.mimir.fullEntry.Contains('Arch Mimir'))
    Write-Host ('  mimir.fullEntry has Broken Mimir: ' + $parsed.mimir.fullEntry.Contains('Broken Mimir'))
    Write-Host ('  mimir.fullEntry has NO Masked: ' + (-not $parsed.mimir.fullEntry.Contains('The Masked')))
    Write-Host ('  mimir.fullEntry has NO Unwoven: ' + (-not $parsed.mimir.fullEntry.Contains('Unwoven')))
    Write-Host ('  neth.summary has High Neth: ' + $parsed.neth.summary.Contains('High Neth'))
    Write-Host ('  neth.fullEntry has High Neth (Velun): ' + $parsed.neth.fullEntry.Contains('High Neth (Velun)'))
    Write-Host ('  velun type: ' + $parsed.velun.type)
    Write-Host ('  merryn type: ' + $parsed.merryn.type)
    Write-Host ('  rime_born type: ' + $parsed.rime_born.type)
    Write-Host ('  human entry present: ' + ($null -ne $parsed.human))
    if ($parsed.human) {
        Write-Host ('  human.term: ' + $parsed.human.term)
        Write-Host ('  human.type: ' + $parsed.human.type)
        Write-Host ('  human.relatedTerms count: ' + (@($parsed.human.relatedTerms)).Count)
    }
    $badKeys = @('SyncRoot','Count','Length','LongLength','Rank','IsReadOnly','IsFixedSize','IsSynchronized')
    $leaks = $badKeys | Where-Object { $parsed.PSObject.Properties.Name -contains $_ }
    if ($leaks) { throw ('leaks: ' + $leaks) }
} catch {
    Write-Host ('INVALID: ' + $_)
    Write-Host ('Temp KEPT: ' + $tempPath)
    throw
}

Move-Item -LiteralPath $tempPath -Destination $path -Force
Write-Host ''
Write-Host ('Replaced. MD5: ' + (Get-FileHash -LiteralPath $path -Algorithm MD5).Hash)
Write-Host '=== DONE ==='
