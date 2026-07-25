# Apply Seelie Accord implementation:
#   1. Insert new seelie_accord top-level entry
#   2. Patch the_revel paragraph 1 to reference Seelie Accord by name + add relatedTerm
#   3. Patch bri-yrn to add apolitical clarification paragraph + add relatedTerm
#   4. Add seelie_accord to pooka relatedTerms
$ErrorActionPreference = 'Stop'
$path = 'D:\VTT\vtt-react\public\data\lore.json'
$tempPath = $path + '.seelie-tmp'
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

# ===== STEP 1: Patch the_revel paragraph 1 =====
Write-Host '=== STEP 1: Patch the_revel paragraph 1 ==='
$revelOldP1Actual = "Before the fog, before the Breach, the deep ironwood groves rang with the music of the fae courts when the seasons turned. The Revel is what is left of that music when the Wyrd got into it."
$revelNewP1Actual = "Before the fog, before the Breach, the deep ironwood groves rang with the music of the Seelie Accord when the seasons turned. The Revel is what is left of that music when the Wyrd got into it - the rites of the Accord\u0027s celebration, trapped mid-turn and weaponized. The Revel Court is one of the splinters that survived the Breach-shattering of the Seelie, and it is the only one that still dances."
# Note: \u0027 should be literal in source; will be preserved by ConvertTo-JsonEscaped since the actual char is \
# But ConvertTo-JsonEscaped converts apostrophes; we want the \u0027 escape form. Build properly:
$revelNewP1Actual = "Before the fog, before the Breach, the deep ironwood groves rang with the music of the Seelie Accord when the seasons turned. The Revel is what is left of that music when the Wyrd got into it - the rites of the Accord's celebration, trapped mid-turn and weaponized. The Revel Court is one of the splinters that survived the Breach-shattering of the Seelie, and it is the only one that still dances."
# Replace ASCII hyphen with em-dash for " - "
$emDash = [char]0x2014
$revelNewP1Actual = $revelNewP1Actual -replace ' - ', (' ' + $emDash + ' ')

$revelOldFileForm = ConvertTo-JsonEscaped $revelOldP1Actual
$revelNewFileForm = ConvertTo-JsonEscaped $revelNewP1Actual
$occRevel = ([regex]::Matches($txt, [regex]::Escape($revelOldFileForm))).Count
if ($occRevel -ne 1) { throw ('the_revel P1 uniqueness: ' + $occRevel) }
$txt = $txt.Replace($revelOldFileForm, $revelNewFileForm)
Write-Host '  [OK] the_revel paragraph 1 patched'

# ===== STEP 2: Patch bri-yrn to add apolitical clarification =====
Write-Host ''
Write-Host '=== STEP 2: Patch bri-yrn (add apolitical paragraph) ==='
# Find a good insertion point: end of paragraph 2 (which ends with "The Thalren ledger-wards mark the Grimmwood\u0027s edge and go no further.")
$byrnAnchor = "The Thalren ledger-wards mark the Grimmwood\u0027s edge and go no further."
$byrnAnchorActual = "The Thalren ledger-wards mark the Grimmwood's edge and go no further."
$byrnAnchorFileForm = ConvertTo-JsonEscaped $byrnAnchorActual
$byrnAnchorOcc = ([regex]::Matches($txt, [regex]::Escape($byrnAnchorFileForm))).Count
if ($byrnAnchorOcc -ne 1) { throw ('bri-yrn anchor uniqueness: ' + $byrnAnchorOcc) }

$byrnNewPara = "She never sat in the Seelie Accord. The Solitary Ones - the hermits and craft-brokers who pre-date the courts and outlast them - answer to no faction. Bri-Yrn\u0027s authority comes from her age and her craft, not from any claim of Seelie heritage. The Hedgerow Pooka will tell you she is one of them in spirit; she will not confirm it. The Revel Court calls her a traitor to the celebration; she does not dignify that with a response. The Thalren ledger-wards list her as \u0027fae - political affiliation: none\u0027 which, for once, is correct."
# Build with actual chars; let ConvertTo-JsonEscaped handle apostrophes and em-dashes
$byrnNewParaActual = "She never sat in the Seelie Accord. The Solitary Ones - the hermits and craft-brokers who pre-date the courts and outlast them - answer to no faction. Bri-Yrn's authority comes from her age and her craft, not from any claim of Seelie heritage. The Hedgerow Pooka will tell you she is one of them in spirit; she will not confirm it. The Revel Court calls her a traitor to the celebration; she does not dignify that with a response. The Thalren ledger-wards list her as 'fae - political affiliation: none' which, for once, is correct."
$byrnNewParaActual = $byrnNewParaActual -replace ' - ', (' ' + $emDash + ' ')
$byrnNewParaFileForm = ConvertTo-JsonEscaped $byrnNewParaActual

# Insert after the anchor (append new paragraph to the existing fullEntry).
# The anchor ends with "go no further." and is followed by `\n\nShe practices...` (next paragraph).
# Insert new paragraph BEFORE "She practices".
$nextParaStart = "She practices the old fae craft"
$nextParaStartFileForm = ConvertTo-JsonEscaped $nextParaStart
$npOcc = ([regex]::Matches($txt, [regex]::Escape($nextParaStartFileForm))).Count
if ($npOcc -ne 1) { throw ('bri-yrn next-paragraph anchor uniqueness: ' + $npOcc) }

# Insert: "\n\n<new para>\n\n" before the next paragraph start
$insertBlock = '\n\n' + $byrnNewParaFileForm + '\n\n'
$txt = $txt.Replace($nextParaStartFileForm, $insertBlock + $nextParaStartFileForm)
Write-Host '  [OK] bri-yrn apolitical paragraph inserted'

# ===== STEP 3: Add seelie_accord to the_revel + bri-yrn + pooka relatedTerms =====
Write-Host ''
Write-Host '=== STEP 3: Add seelie_accord to relatedTerms of the_revel, bri-yrn, pooka ==='

function Add-ToRelatedTerms {
    param([ref]$txtRef, [string]$entryKey, [string[]]$newItems, [string]$label)
    $pattern = '(?m)^\s*"' + [regex]::Escape($entryKey) + '":\s*\{'
    $entryMatch = [regex]::Match($txtRef.Value, $pattern)
    if (-not $entryMatch.Success) { throw ('[' + $label + '] entry not found: ' + $entryKey) }
    $entryIdx = $entryMatch.Index
    $rtIdx = $txtRef.Value.IndexOf('"relatedTerms"', $entryIdx)
    if ($rtIdx -lt 0) { throw ('[' + $label + '] no relatedTerms') }
    $bracketOpen = $txtRef.Value.IndexOf('[', $rtIdx)
    $bracketClose = $txtRef.Value.IndexOf(']', $bracketOpen)
    $lastNl = $txtRef.Value.LastIndexOf("`n", $bracketClose - 1)
    $secondLastNl = $txtRef.Value.LastIndexOf("`n", $lastNl - 1)
    if ($secondLastNl -lt $bracketOpen) { throw ('[' + $label + '] single-line array') }
    $itemLineStart = $secondLastNl + 1
    $lastItemLine = $txtRef.Value.Substring($itemLineStart, $lastNl - $itemLineStart)
    $itemIndent = ([regex]::Match($lastItemLine, '^\s*')).Value
    $itemContent = $lastItemLine.Trim()
    if ($itemContent.EndsWith(',')) { throw ('[' + $label + '] last item ends with comma') }
    $newItemsBlock = ($newItems | ForEach-Object { ($itemIndent + '"' + $_ + '"') }) -join ",`n"
    $replacement = $itemIndent + $itemContent + ",`n" + $newItemsBlock
    $oldText = $itemIndent + $itemContent
    $txtRef.Value = $txtRef.Value.Remove($itemLineStart, $oldText.Length).Insert($itemLineStart, $replacement)
    Write-Host ('  [OK] ' + $label)
}

Add-ToRelatedTerms ([ref]$txt) 'the_revel' @('seelie_accord') 'the_revel.relatedTerms += seelie_accord'
Add-ToRelatedTerms ([ref]$txt) 'bri-yrn' @('seelie_accord') 'bri-yrn.relatedTerms += seelie_accord'
Add-ToRelatedTerms ([ref]$txt) 'pooka' @('seelie_accord') 'pooka.relatedTerms += seelie_accord'

# ===== STEP 4: Insert new seelie_accord top-level entry =====
Write-Host ''
Write-Host '=== STEP 4: Insert new seelie_accord top-level entry ==='
$seelieEntry = @'
    "seelie_accord":  {
                          "id":  "seelie_accord",
                          "term":  "The Seelie Accord",
                          "type":  "faction",
                          "region":  "frostwood-reach",
                          "summary":  "The unified fae court that governed the Frostwood Reach before the Breach. It shattered during the cataclysm into competing factions, each claiming to be the rightful heir to the old Accord - and each preserving a different piece of what the Accord used to mean.",
                          "fullEntry":  "Before the fog, before the Breach, the fae of the Frostwood Reach were one people under the Seelie Accord. The Accord was not a throne and not a crown; it was a contract - a set of mutual obligations between the fae-blooded powers that kept the deep ironwood in balance and the moonlit groves in trust. The Pooka guarded the hedgerows under it. The storm-glass weavers kept the high aeries. The mask-carvers set the rites that turned the seasons. And the accord-broker, when one was needed, walked the deepest groves with authority no throne could give. The system held for as long as anyone could remember.\n\nThe Breach broke the contract. When the Wyrd seeped into the ironwood and the Fog Compact fell across the Reach, the obligations that held the fae together stopped binding. The Accord did not die - it shattered, the way a mirror shatters, and each splinter faction took with it a fragment of the old reflection. Now there is no single Seelie court. There are the factions that claim its name.\n\nThe Hedgerow claims the guardianship. The Pooka and their kin keep the old mandate of watching the wild places, and they will tell you, with some authority, that they alone still do what the Accord was for. The Revel Court claims the rites - the seasonal celebrations, the turning songs, the moonlit dancing - except the Wyrd got into their rites long ago, and what they preserve is the shape of the celebration without the joy. The Solitary Ones claim nothing. They are the fae who refused to join any splinter: the hermits, the crones, the ancient craft-brokers who pre-date the Accord and outlasted it. They do not call themselves Seelie. They do not call themselves anything. The Accord they remember is the one nobody else does.\n\nWalk the Frostwood Reach and ask which faction holds the true Seelie heritage, and each will give you a different answer with absolute certainty. The Thalren ledger-wards mark them all as 'fae - political affiliation: contested' and decline to arbitrate. The Florae, who made their own bargain outside the Accord's frame, do not ask.",
                          "relatedTerms":  [
                                               "pooka",
                                               "the_revel",
                                               "bri-yrn",
                                               "frostwood-reach",
                                               "grimmwood",
                                               "ironwood_heart",
                                               "briaran",
                                               "house_viridane",
                                               "the_breach",
                                               "the_wyrd",
                                               "memory_fog_mechanics"
                                           ]
                      }
'@
# Replace ASCII hyphens with em-dashes for ` - ` patterns (the here-string above uses ASCII to avoid PS source mojibake)
$seelieEntry = $seelieEntry -replace ' - ', (' ' + $emDash + ' ')

# Find root close pattern
$rootPattern = '(?s)\r?\n\s*\}\r?\n\s*\}\s*$'
$rootMatch = [regex]::Match($txt, $rootPattern)
if (-not $rootMatch.Success) { throw ('Root close not found') }
$matchVal = $rootMatch.Value
$firstBrace = $matchVal.IndexOf('}')
$lastBrace = $matchVal.LastIndexOf('}')
$beforeFirst = $matchVal.Substring(0, $firstBrace + 1)
$between = $matchVal.Substring($firstBrace + 1, $lastBrace - $firstBrace - 1)
$afterLast = $matchVal.Substring($lastBrace)
$replacement = $beforeFirst + "," + $between + $seelieEntry + $between + $afterLast
$txt = $txt.Remove($rootMatch.Index, $rootMatch.Length).Insert($rootMatch.Index, $replacement)
Write-Host '  [OK] seelie_accord entry inserted'

# ===== STEP 5: Write temp + validate =====
[System.IO.File]::WriteAllText($tempPath, $txt)
Write-Host ''
Write-Host ('Wrote temp: ' + $tempPath + ' (' + (Get-Item $tempPath).Length + ' bytes)')
try {
    $parsed = Get-Content -Raw -LiteralPath $tempPath | ConvertFrom-Json
    $count = ($parsed.PSObject.Properties | Measure-Object).Count
    Write-Host ('Parse OK. Entries: ' + $count + ' (expect 316 = 315 + seelie_accord)')
    if ($count -ne 316) { throw ('count mismatch: ' + $count) }
    Write-Host ('  seelie_accord.term: ' + $parsed.seelie_accord.term)
    Write-Host ('  seelie_accord.type: ' + $parsed.seelie_accord.type)
    Write-Host ('  seelie_accord.fullEntry has Solitary Ones: ' + $parsed.seelie_accord.fullEntry.Contains('The Solitary Ones'))
    Write-Host ('  the_revel.fullEntry has Seelie Accord: ' + $parsed.the_revel.fullEntry.Contains('Seelie Accord'))
    Write-Host ('  the_revel.relatedTerms has seelie_accord: ' + ($parsed.the_revel.relatedTerms -contains 'seelie_accord'))
    Write-Host ('  bri-yrn.fullEntry has Solitary Ones: ' + $parsed.'bri-yrn'.fullEntry.Contains('The Solitary Ones'))
    Write-Host ('  bri-yrn.relatedTerms has seelie_accord: ' + ($parsed.'bri-yrn'.relatedTerms -contains 'seelie_accord'))
    Write-Host ('  pooka.relatedTerms has seelie_accord: ' + ($parsed.pooka.relatedTerms -contains 'seelie_accord'))
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
