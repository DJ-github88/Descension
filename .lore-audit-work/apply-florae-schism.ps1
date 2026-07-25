# Apply Florae schism changes to lore.json via raw-text operations.
# v3: fixed indent-extraction bug, fixed root-close regex, atomic write via temp file.

$ErrorActionPreference = 'Stop'
$path = "D:\VTT\vtt-react\public\data\lore.json"
$tempPath = "$path.florae-tmp"
$txt = [System.IO.File]::ReadAllText($path)

function Find-EntryIndex {
    param([string]$json, [string]$key)
    $pattern = '(?m)^\s*"' + [regex]::Escape($key) + '":\s*\{'
    $m = [regex]::Match($json, $pattern)
    if (-not $m.Success) { throw "Entry key not found: $key" }
    return $m.Index
}

function Get-ArrayLastItem {
    param([string]$json, [int]$arrayStartAfterColon)
    # Find the closing `]` for this array
    $bracketIdx = $json.IndexOf('[', $arrayStartAfterColon)
    if ($bracketIdx -lt 0) { throw "No [ after relatedTerms" }
    $closeIdx = $json.IndexOf(']', $bracketIdx)
    if ($closeIdx -lt 0) { throw "No matching ]" }

    # Walk backwards from closeIdx, collecting newlines. We want the line that contains
    # the LAST actual array item (not the line with the `]`).
    $lastNl = $json.LastIndexOf("`n", $closeIdx - 1)
    $secondLastNl = $json.LastIndexOf("`n", $lastNl - 1)
    if ($secondLastNl -lt $bracketIdx) {
        # The last item is on the same line as `[` (rare). Not expected in this file.
        throw "Unexpected: only one newline between [ and ]"
    }
    # The last item's full LINE (excluding the trailing newline) starts at secondLastNl+1
    # and extends to lastNl (exclusive).
    $itemLineStart = $secondLastNl + 1
    $lastItemLine = $json.Substring($itemLineStart, $lastNl - $itemLineStart)
    # Item indent = leading whitespace of this line
    $wsMatch = [regex]::Match($lastItemLine, '^\s*')
    $itemIndent = $wsMatch.Value
    $itemContent = $lastItemLine.Trim()
    if (-not $itemContent) { throw "Empty last item content" }
    if ($itemContent.EndsWith(',')) { throw "Last item already ends with comma -- unexpected format" }

    # LastItemStartInFile points to the START of the line (i.e., the start of the indent),
    # so that Remove+Insert replaces the full line.
    return @{
        ItemContent = $itemContent
        ItemIndent  = $itemIndent
        LastItemStartInFile = $itemLineStart
    }
}

function Add-ToRelatedTerms {
    param([ref]$txtRef, [string]$entryKey, [string[]]$newItems, [string]$label)
    $entryIdx = Find-EntryIndex $txtRef.Value $entryKey
    $rtIdx = $txtRef.Value.IndexOf('"relatedTerms"', $entryIdx)
    if ($rtIdx -lt 0) { throw "[$label] no relatedTerms in $entryKey" }
    $info = Get-ArrayLastItem $txtRef.Value $rtIdx
    Write-Host "  [$label] last item='$($info.ItemContent)' indent=$($info.ItemIndent.Length) spaces, startPos=$($info.LastItemStartInFile)"

    # Build replacement: <itemIndent><itemContent>,\n<itemIndent>"new1",\n<itemIndent>"new2",...
    $newItemsBlock = ($newItems | ForEach-Object { "$($info.ItemIndent)`"$_`"" }) -join ",`n"
    $replacement = "$($info.ItemIndent)$($info.ItemContent),`n$newItemsBlock"
    $oldText = "$($info.ItemIndent)$($info.ItemContent)"

    $txtRef.Value = $txtRef.Value.Remove($info.LastItemStartInFile, $oldText.Length).Insert($info.LastItemStartInFile, $replacement)
    Write-Host "  [OK] $label"
}

function Replace-Once {
    param([string]$label, [ref]$txtRef, [string]$old, [string]$new)
    $count = ([regex]::Matches($txtRef.Value, [regex]::Escape($old))).Count
    if ($count -ne 1) { throw "UNIQUENESS FAILED [$label]: found $count occurrences" }
    $txtRef.Value = $txtRef.Value.Replace($old, $new)
    Write-Host "  [OK] $label"
}

Write-Host "=== PATCH 1: briaran.fullEntry (append schism sentence) ==="
$briaranOld = "the Unwritten Word, which hears a spoken lie the way a foot feels a false step."
$briaranNew = "the Unwritten Word, which hears a spoken lie the way a foot feels a false step. Two subraces carry the contract\u0027s price in different flesh: the thorn-blooded Viridian, who keep the refusal in their forearms, and the timber-born Oken, whose crude branch-arms grew from the same bargain. The fae who brokered the pact \u2014 Bri-Yrn, called the Grimm-Mother \u2014 still dwells in the Grimmwood, shunned by both."
Replace-Once "briaran.fullEntry append" ([ref]$txt) $briaranOld $briaranNew

Write-Host ""
Write-Host "=== PATCH 1b: briaran.relatedTerms ==="
Add-ToRelatedTerms ([ref]$txt) 'briaran' @('viridian','oken','bri-yrn') 'briaran.relatedTerms'

Write-Host ""
Write-Host "=== PATCH 2: thorn-speaker ==="
$tsSumOld = '"summary":  "The elected voice of the Trueborn Florae, whose forearms bristle with living barbs. They reject the Fog Compact as surrender, and every word they speak is a thorn."'
$tsSumNew = '"summary":  "The elected voice of the Viridian \u2014 the thorn-blooded Trueborn of the Florae \u2014 whose forearms bristle with living barbs. They reject the Fog Compact as surrender, and every word they speak is a thorn."'
Replace-Once "thorn-speaker.summary" ([ref]$txt) $tsSumOld $tsSumNew

$tsFeOld = "The Trueborn Florae live in the Frostwood\u0027s deepest groves"
$tsFeNew = "The Viridian, the Trueborn Florae, live in the Frostwood\u0027s deepest groves"
Replace-Once "thorn-speaker.fullEntry phrase 1" ([ref]$txt) $tsFeOld $tsFeNew

$tsFeOld2 = "the Thorn-Speaker is the voice they elected to speak for them."
$tsFeNew2 = "the Thorn-Speaker is the voice the Viridian elected to speak for them."
Replace-Once "thorn-speaker.fullEntry phrase 2" ([ref]$txt) $tsFeOld2 $tsFeNew2

Add-ToRelatedTerms ([ref]$txt) 'thorn-speaker' @('viridian') 'thorn-speaker.relatedTerms'

Write-Host ""
Write-Host "=== PATCH 3: grimmwood ==="
$grmFEold = "they do not care about your ledger or your name."
$grmFEnew = "they do not care about your ledger or your name. Deep in the Grimmwood\u0027s oldest stand dwells Bri-Yrn, called the Grimm-Mother \u2014 the Fair Folk hermit who brokered the contract that split House Viridane into thorn and timber. The Florae claim the Grimmwood as rootland but will not walk where she walks; the Thalren ledger-wards mark the edge and go no further. The woodcutters of Drunhold say her name aloud only as a warning."
Replace-Once "grimmwood.fullEntry append" ([ref]$txt) $grmFEold $grmFEnew

Add-ToRelatedTerms ([ref]$txt) 'grimmwood' @('bri-yrn') 'grimmwood.relatedTerms'

Write-Host ""
Write-Host "=== INSERT 3 NEW TOP-LEVEL ENTRIES ==="
$entriesJson = @'
    "viridian":  {
                     "id":  "viridian",
                     "term":  "Viridian",
                     "type":  "subrace",
                     "region":  "frostwood-reach",
                     "summary":  "The thorn-blooded subrace of the Florae, whose forearms bristle with the living barbs of the old fae-contract and who reject the Fog Compact as surrender.",
                     "fullEntry":  "When the contract came for House Viridane, it took two prices, and the bloodline split around them. The Viridian paid the first price in thorns. Their forearms bristle with living barbs \u2014 the physical mark of the old fae-contract, grown out of the skin in the deep ironwood groves where the bargain was struck. They are the Trueborn, the ones who kept the refusal in their flesh. The Thorn-Speaker is the voice they elected to speak for them, and every word that one says is a thorn.\n\nThe Viridian reject the Fog Compact entirely. Where House Thalreth traded the Reach\u0027s clarity for insulating mist, the Viridian believe the fog itself is the enemy, slowly erasing everything that made the forest sacred. They tend the moonlit groves where House Viridane\u0027s uncorrupted Monolith fragment was hidden, and the cleansing key the scholars speak of runs in their thorn-blood, waiting for the day Sol must be washed of Keth-Amar\u0027s taint. They carry the Unwritten Word, a truth-sense that hears a spoken lie the way a foot feels a false step.\n\nWalk the deep groves with thorns on your arms and the Viridian will recognize you. Walk them without, and the fog will reach you before they do.",
                     "relatedTerms":  [
                                          "briaran",
                                          "bramble_heath",
                                          "greythorn_copse",
                                          "grimmwood",
                                          "house_viridane",
                                          "house_thalreth",
                                          "ironwood_heart",
                                          "oken",
                                          "thorn-speaker",
                                          "bri-vessela",
                                          "bri-yrn",
                                          "house_morrath"
                                      ]
                 },
    "oken":  {
                 "id":  "oken",
                 "term":  "Oken",
                 "type":  "subrace",
                 "region":  "frostwood-reach",
                 "summary":  "The treanty subrace of the Florae, whose crude branch-arms of oak, birch, and willow carry the second price of the fae-contract: a body woven into living timber.",
                 "fullEntry":  "When the contract came for House Viridane, the Oken paid the second price. Where the Viridian grew thorns, the Oken grew wood. Their arms are crude, natural tree boughs \u2014 oak, birch, willow, pine, or mountain rowan \u2014 that split into flexible twig-fingers sprouting fresh green leaf-buds when hydrated. Sap runs in their veins where the Viridian carry barbs. They are the tree-born, the charming and resilient treant-kin whose coarse-barked faces and amber eyes still carry the warm heartwood core of a house the world tried to erase.\n\nThe Oken did not refuse the Fog Compact \u2014 they endure it. Where the Viridian retreated into the deep groves to keep the refusal alive, the Oken moved through the Ledgered towns, pruning themselves neat and walking under high-collared coats with the unstitched Viridane crest patch at the breast. A Shorn Oken can pass in Drunhold or Greymark Keep long enough to trade; a Wild Oken stays in the canopy villages where the Sapling-Sprouts are planted in mossy soil and sung into shape by elders with copper water-flasks at their belts.\n\nBring fresh water to an Oken and they will share what they have. Bring a lie, and they will hear it \u2014 the truth-sense runs in both bloodlines, thorn and timber alike \u2014 but they are slower to anger than their thorned kin, and more likely to forgive the fog for falling.",
                 "relatedTerms":  [
                                      "briaran",
                                      "drunhold",
                                      "frostwood-reach",
                                      "grimmwood",
                                      "greythorn_copse",
                                      "house_viridane",
                                      "ironwood_heart",
                                      "viridian",
                                      "bri-yrn"
                                  ]
             },
    "bri-yrn":  {
                    "id":  "bri-yrn",
                    "term":  "Bri-Yrn, the Grimm-Mother",
                    "type":  "character",
                    "role":  "Fair Folk hermit and keeper of the Florae\u0027s founding contract",
                    "region":  "frostwood-reach",
                    "summary":  "A shunned Fair Folk hermit dwelling deep in Grimmwood, called the Grimm-Mother by those who will not speak her true name. She brokered the fae-contract that transformed House Viridane into the Florae.",
                    "fullEntry":  "Bri-Yrn is older than the Florae and older than the fog, and she lives where the Grimmwood is densest, in a stand of ironwood that the woodcutters of Drunhold will not mark and the Trueborn Florae will not enter. She is Fair Folk \u2014 not Florae, not thorn-blood, not timber-born, but one of the originals who walked the paths before the Wyrd seeped in. The locals call her the Grimm-Mother because they will not say Bri-Yrn aloud; they believe the name, spoken, is a summons.\n\nShe is the broker of the contract that split House Viridane. When the seventh house fled south through the Frostwood Reach while the sacrifice fires still burned for the other houses, it was Bri-Yrn who reached them in the moonlit groves with an offer that did not end in their children\u0027s blood on northern stone. The price was paid two ways: in thorns for the Viridian, in timber for the Oken. Both bloodlines flow from her word, and neither bloodline will thank her for it. The Viridian shun her for what the thorns cost. The Oken shun her for what the timber replaced. The Thalren ledger-wards mark the Grimmwood\u0027s edge and go no further.\n\nShe practices the old fae craft the woodcutters call witch-doctoring \u2014 the binding, the mending, and the hexwork that predates the runic academies and the Scribe-Cartel\u0027s ink. Those who fall out of the Ledgered world, the desperate, the dispossessed, and the dying, sometimes find their way to her stand of ironwood. What they pay for her help is not always coin. Walk into the Grimmwood looking for Bri-Yrn and you will find her, or you will find the Grimmstalks first; the wood does not care which, and neither, in the end, does she.",
                    "relatedTerms":  [
                                         "briaran",
                                         "viridian",
                                         "oken",
                                         "grimmwood",
                                         "house_viridane",
                                         "frostwood-reach",
                                         "thorn-speaker",
                                         "bri-vessela"
                                     ]
                }
'@

# Fixed regex: allow whitespace before the closing braces.
# Tail pattern: newline + whitespace* + } + newline + whitespace* + } + trailing whitespace/end
$pattern = '(?s)\r?\n\s*\}\r?\n\s*\}\s*$'
$m = [regex]::Match($txt, $pattern)
if (-not $m.Success) {
    Write-Host "Tail (last 200 chars):"
    Write-Host ($txt.Substring([Math]::Max(0, $txt.Length - 200)) -replace "`r", '\r' -replace "`n", '\n')
    throw "Could not find root-close pattern at end of file"
}
Write-Host "  Root-close match at idx $($m.Index), len $($m.Length)"
$matchVal = $m.Value
# Capture groups: we want to keep the inner structure but add `,` after first `}` and insert entries before second `}`.
# Find the two `}` positions in matchVal
$firstBrace = $matchVal.IndexOf('}')
$lastBrace = $matchVal.LastIndexOf('}')
if ($firstBrace -eq $lastBrace) { throw "Only one `}` in match -- pattern is wrong" }
# Reconstruct:
#   - keep everything up to and including first `}`, add `,`
#   - then newline + indentation matching the file's top-level indent (4 spaces based on the file)
#   - then entriesJson
#   - then the content between first and last `}` (which is the newline+indent before root close)
#   - then last `}`
$beforeFirstBrace = $matchVal.Substring(0, $firstBrace + 1)
$between = $matchVal.Substring($firstBrace + 1, $lastBrace - $firstBrace - 1)
$afterLastBrace = $matchVal.Substring($lastBrace)
$replacement = $beforeFirstBrace + "," + $between + $entriesJson + $between + $afterLastBrace
$openCount  = ([regex]::Matches($replacement, '\{')).Count
$closeCount = ([regex]::Matches($replacement, '\}')).Count
Write-Host "  Replacement braces: open=$openCount close=$closeCount"

$txt = $txt.Remove($m.Index, $m.Length).Insert($m.Index, $replacement)
Write-Host "  [OK] 3 new entries inserted"

Write-Host ""
Write-Host "=== WRITE TO TEMP FILE ==="
[System.IO.File]::WriteAllText($tempPath, $txt)
Write-Host "Wrote temp: $tempPath ($((Get-Item $tempPath).Length) bytes)"

Write-Host ""
Write-Host "=== VALIDATE TEMP FILE PARSES ==="
try {
    $parsed = Get-Content -Raw -LiteralPath $tempPath | ConvertFrom-Json
    $count = ($parsed.PSObject.Properties | Measure-Object).Count
    Write-Host "VALID. Entry count: $count"
    if ($count -ne 314) { throw "Expected 314 entries, got $count" }
    foreach ($key in @('viridian','oken','bri-yrn')) {
        if (-not $parsed.$key) { throw "Missing new entry: $key" }
        Write-Host "  [OK] $key present (type=$($parsed.$key.type), region=$($parsed.$key.region))"
    }
    Write-Host "  briaran.fullEntry has schism sentence: $($parsed.briaran.fullEntry.Contains('Two subraces carry'))"
    Write-Host "  briaran.relatedTerms contains viridian: $($parsed.briaran.relatedTerms -contains 'viridian')"
    Write-Host "  briaran.relatedTerms contains oken: $($parsed.briaran.relatedTerms -contains 'oken')"
    Write-Host "  briaran.relatedTerms contains bri-yrn: $($parsed.briaran.relatedTerms -contains 'bri-yrn')"
    Write-Host "  thorn-speaker.summary has Viridian: $($parsed.'thorn-speaker'.summary.Contains('Viridian'))"
    Write-Host "  thorn-speaker.relatedTerms contains viridian: $($parsed.'thorn-speaker'.relatedTerms -contains 'viridian')"
    Write-Host "  grimmwood.fullEntry has Bri-Yrn: $($parsed.grimmwood.fullEntry.Contains('Bri-Yrn'))"
    Write-Host "  grimmwood.relatedTerms contains bri-yrn: $($parsed.grimmwood.relatedTerms -contains 'bri-yrn')"
    # Check for PS internal property leaks (shouldn't be any since we didn't re-serialize)
    $badKeys = @('SyncRoot','Count','Length','LongLength','Rank','IsReadOnly','IsFixedSize','IsSynchronized')
    $leaks = $badKeys | Where-Object { $parsed.PSObject.Properties.Name -contains $_ }
    if ($leaks) { throw "PS internal property leak: $leaks" } else { Write-Host "  [OK] No PS internal property leaks" }
} catch {
    Write-Host "JSON INVALID: $_"
    Write-Host "Temp file KEPT for inspection: $tempPath"
    throw
}

Write-Host ""
Write-Host "=== ATOMIC REPLACE: source <- temp ==="
Move-Item -LiteralPath $tempPath -Destination $path -Force
Write-Host "Replaced. Final size: $((Get-Item $path).Length) bytes"
Write-Host "Final MD5: $((Get-FileHash -LiteralPath $path -Algorithm MD5).Hash)"
Write-Host ""
Write-Host "=== ALL DONE ==="
