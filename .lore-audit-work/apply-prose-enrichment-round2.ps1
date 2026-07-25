# Round 2 prose enrichment: 11 Wyrd creatures.
# Reuses the proven approach from apply-prose-enrichment.ps1 (round 1).

$ErrorActionPreference = 'Stop'
$path = 'D:\VTT\vtt-react\public\data\lore.json'
$tempPath = $path + '.prose2-tmp'
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

$targets = @(
    @{
        Key = 'storm_crows'
        NewFullEntry = @"
The Tesshan bridge-lords trust their lookouts and their signal-horns, but on the highest spires of the Cragjaw Peaks, the lookouts hear things. The Storm-Crows nest up where the air thins and the Fexric pipeline-bridges strain under rime. They are eight-foot raven-things with feathers that crackle with static and cold-iron dust, and their heads are bare bird-skulls — and they speak. Not with a voice of their own. With yours.

A Storm-Crow flock hunts by mimicry. They will call a child's name in the child's own voice to lead a search party off a cliff. They will bark a Fexric engineer's orders in the engineer's cadence to send a work crew into a dead pipeline. They will scream, perfectly, the last words of someone who fell last winter. The Cragjaw lookouts have a rule: if you hear a voice from above you, it is a Storm-Crow; the real thing always calls from below or beside. It is a good rule. The Storm-Crows have learned to call from below.
"@
        NewRelatedTerms = @('house_tesshan','fexrick','cragjaw-peaks')
    },
    @{
        Key = 'rimor'
        NewFullEntry = @"
The Skaldic longhouses burn their fires day and night through the Nordhalla winter, and the cold waits for the moment they go dark. The Rimor is the cold's opportunist. It is a small thing, the size and shape of a gnarled lump of coal, with eyes like the last dull glow of a dying fire and a mouth that is a siphon. It crawls down chimneys in the dark hours and nests in the ash, and it drinks.

A longhouse with a Rimor in the hearth does not go cold all at once. The mugs freeze first. Then the children get tired. Then the parents cannot remember why they were angry, or why they were talking, or what the argument was about, and by the time anyone thinks to check the fire the longhouse is a tomb of frost-rimed silence and the Rimor is still drinking. The Skalds drive them out with alchemical heat — a burst of forge-fire hot enough to scorch the chimney stones — but a longhouse that has been Rimor-touched never quite warms again. The cold has learned the shape of the place.
"@
        NewRelatedTerms = @('house_skalvyr','skald','nordhalla')
    },
    @{
        Key = 'sere_khan'
        NewFullEntry = @"
The Ordavan ancestors are not gentle, and the steppe keeps their law. The Sere-Khan is the law given horse and a gavel. It rides out of the Ancestor-Mounds in the dry season, a towering skeletal warrior in rusted scale-armor on a spectral horse, carrying a heavy jade gavel and a scroll of judgment. It speaks in a low throat-singing tone that the ground transmits more than the air, and when it speaks, the ancestors are listening.

Those the Sere-Khan intercepts are tried. The court is short and the terms are ancestral: the defendant must answer in the language of compacts, debts, and inherited oaths, or be condemned. The Ordavan nomads know the defense and can usually satisfy the court; a stranger on the steppe, without lineage-memory of an ancestral contract, will almost certainly be found wanting. The Sere-Khan does not pursue those who pass its judgment. It does not need to. The ancestors remember who was tried, and who was not, and the steppe is long.
"@
        NewRelatedTerms = @('house_ordavan','sundrift-vale','lien')
    },
    @{
        Key = 'sump_scrabs'
        NewFullEntry = @"
The Fexric built the geothermal pipeline network eight millennia ago, and for eight millennia something has nested in it. The Sump-Scrabs came first as alchemical residue in the early holdfast boilers — a beetle the size of a dog, its shell black basalt plates and copper veins, with a long tube-siphon for a mouth that drinks steam and combustion the way a mosquito drinks blood. They are not Wyrd-spawn in the usual sense. They are older. The Wyrd just made them hungrier.

A Sump-Scrab infestation freezes a pipeline dead. The Fexric engineers have spent generations culling them and the Sump-Scrabs have spent generations eating the engineers' heat-lanterns, and the war continues. The problem for travelers is that Sump-Scrabs are not picky about the source of combustion. A campfire in the wrong Cragjaw ravine will draw them in an hour. The Fexric advised: sleep near steam, not flame; the pipeline-burns are too hot for the Scrabs and the steam carries your scent away. It is good advice. The Scrabs have started learning it.
"@
        NewRelatedTerms = @('fexrick','house_tesshan','cragjaw-peaks')
    },
    @{
        Key = 'grandmother_of_the_bog'
        NewFullEntry = @"
The Bryngloom peat-bogs remember everything that falls into them, and the Grandmother of the Bog is what the remembering looks like when it stands up. She is seven feet tall, draped in peat-moss and willow-root, with amber eyes that glow through the bog-mist at dusk. She carries a wooden spoon and a pot of soup that has been boiling since before the Binding, and the soup is made of bog-lichen and memory.

She does not attack. She bargains. Travelers dying of bog-fever or old wounds find their way to her quagmire and she offers them what no one else in the Bryngloom will: more time. The price is paid in memory. She will take a childhood, a marriage, a face, a name — the soup requires it — and in exchange the years are extended. The Neth call her an unlicensed pact-broker and forbid dealing with her under the First Contract. The Neth are not the ones dying in her bogs. Those who are generally sign.
"@
        NewRelatedTerms = @('neth','vel_keth_bayou','bryngloom-forest','debt_revenant')
    },
    @{
        Key = 'debt_revenant'
        NewFullEntry = @"
The Neth First Contract binds the living, but it also binds the dead. A Neth debtor who dies with terms unfulfilled does not rest. The peat preserves the body. The contract preserves the obligation. And eventually, somewhere in the deep bogs of the Bryngloom, the debtor sits up.

A Debt-Revenant rises in rusted Neth scale-armor wrapped in rotting peat-bonds, its eyes cold blue lanterns and the contract that binds it folded into the chest cavity where the heart used to be. It does not pursue the living randomly. It pursues the specific terms of its own unfinished contract — a delivery that was never made, a witness who was never produced, a debt that was never paid — and it will walk through anyone who blocks the path to fulfilling it. The only ways to put one down for good are to fulfill the contract or to burn the document with pact-fire. The Neth registry-priests are willing to do this for a fee. They are not willing to do it for free. The Debt-Revenant, after all, is what the Contract is for.
"@
        NewRelatedTerms = @('neth','atropolis','house_morrath','bryngloom-forest')
    },
    @{
        Key = 'spume_of_the_drowned'
        NewFullEntry = @"
The Iceheart Sea takes a ship every winter, and in the spring it gives something back. The Spume of the Drowned is what the sea gives. It is a floating mass of glowing sea-spume and ice crystals ten feet across, shifting constantly to project the faces of sailors who went down with the last ship — screaming, drowning, freezing, in a loop that never ends. It makes a wet choking sound that carries across the open water.

The Spume is not the sailors. The sailors are gone. The Spume is the Wyrd crystallizing the final panic of a dying crew into a memory-colony that drifts the shipping lanes looking for warmth to merge with. Anything it touches gets a coat of freezing slime that sets solid in minutes. The Mereval captains have a rule: if you see a glow on the water at night that does not blink, you do not approach. The Myrathil have a different rule. The Deepling Myrathil, who knew the drowned, sometimes row out to meet the Spume carrying the dead's names. They say it quiets for a while afterward. They say it always comes back.
"@
        NewRelatedTerms = @('house_mereval','myrathil','iceheart-sea','skreika')
    },
    @{
        Key = 'writ_of_passage'
        NewFullEntry = @"
The Neth made the First Contract with Morvane, and the Neth have been making contracts ever since. Somewhere in the millennia of charter-writing, the Wyrd got into one. The Writ of Passage is a Wyrd-construct born of that contamination: a literal contract, a large sheet of glowing parchment rimmed with ice, drifting the ocean currents of the Iceheart Sea. Runic script moves across its surface constantly, writing and rewriting maritime terms — passage rights, harbor fees, toll schedules — in a hand that no one employed.

The Writ intercepts vessels at the harbor mouths and the reef-gates. It forces the captain to read and agree to its terms before it allows safe passage. Most captains sign; the terms are usually survivable, and the Writ is patient. Those who refuse, or who sign and then violate a clause, find out what the runic script is for. The Writ lashes with blades of frozen ink that cut through timber and rigging the way paper cuts through skin. The Brine-Bond Syndicate keeps a standing bounty on Writs destroyed; they have never paid it. The Writs, like the contracts they are made of, are very hard to dissolve.
"@
        NewRelatedTerms = @('neth','brine_bond_syndicate','iceheart-sea','house_mereval')
    },
    @{
        Key = 'lien'
        NewFullEntry = @"
The Ordavan steppe runs on tribal debt and oral compact, and the Lien is the steppe's bookkeeper. It is a tall skeletal humanoid wrapped in old parchment contracts that rustle when it moves, its fingers long quill-claws dripping black ink, its face a blank sheet that sometimes shows the debtor's name. It hunts those who carry unpaid promises and it does not stop.

The Lien is notable for what does not slow it. Gravity storms warp the Sundrift Vale's spatial geometry — paths fold, distances stretch, travelers lost in a storm can walk for days and arrive where they started. The Lien is unaffected. It tracks the debtor through the distortion the way a hound tracks blood, walking the true line while the steppe folds around it. There are exactly two ways to end a Lien's hunt: fulfill the contract (the parchment strips fall away, the quill-claws dry, the Lien dissolves into a pile of ink-stained scroll-cases), or pay the debt in blood (the Lien takes a limb, or a life, and the contract considers itself satisfied). The Ordavan nomads say a Lien has never been outrun. The Gambrel hunts broken oaths; the Lien collects on them.
"@
        NewRelatedTerms = @('house_ordavan','gambrel','sundrift-vale','sere_khan')
    },
    @{
        Key = 'hungry_child_creature'
        NewFullEntry = @"
The Ordavan dead are left at the Ancestor-Mounds for the ancestors to weigh, and most are accepted. The Hungry Children are the ones the ancestors sent back. They are small translucent spirits floating just above the steppe grass, their eyes hollow wells of darkness, whispering fragments of star-stories they almost remember but cannot complete. They are starving for the rest.

The Hungry Children attack travelers who carry starlight in memory — and on the Sundrift Vale, the Astril refugees carry the most. The Astril bloodline still holds the echo of Lumia, their devoured home-star, and a Hungry Child who touches an Astril takes the star-memory outright: the warmth, the light, the constellation-patterns of a sky that no longer exists. There is one defense. A Hungry Child can be appeased by a complete and genuine star-story told aloud, full and well-recited, and the spirit will quiet to listen and then drift away satisfied. The Astril carry Lumia's story for this reason among others. The Ordavan steppe-guides carry their own ancestors' stories for the same reason. The Hungry Children do not care whose star. They only want the light.
"@
        NewRelatedTerms = @('astril','house_ordavan','sundrift-vale','sere_khan')
    },
    @{
        Key = 'cycle_eater'
        NewFullEntry = @"
The Bryngloom's sacred willows anchor the forest's reincarnation cycle — the loop by which dying spirits return through root and peat into new growth. The Cycle-Eater is what happens when the Wyrd gets into the loop. It is a massive worm-thing, many-limbed, with a circular mouth of needle teeth and a body sheathed in purple slime that drains magic from the soil it crawls through. It lives in the deep peat-pools and the hollow roots where the cycle runs strongest, and it eats.

A grove occupied by a Cycle-Eater goes grey. The willows stop budding. The spirits of the forest dead, instead of returning, get eaten — dissolved into the purple slime and added to the worm's mass. The Vreken, whose own Reincarnation Bargain with Morvane is bound up in the same root-network, feel each spirit the Cycle-Eater takes. They call it the Quiet Mouth. They will not say its true name. The Bryngloom druids have one method for clearing a Cycle-Eater: drain the pool, burn the roots it nests in, and salt the peat with cold iron. The grove dies, but the cycle restarts elsewhere. Without the draining, the Cycle-Eater just keeps eating. The forest, eventually, goes silent.
"@
        NewRelatedTerms = @('vreken','bryngloom-forest','neth','grandmother_of_the_bog')
    }
)

# === STEP 1: Replace fullEntries ===
$parsed = $txt | ConvertFrom-Json
foreach ($t in $targets) {
    $key = $t.Key
    $entry = $parsed.$key
    if (-not $entry) { throw ('Entry not found: ' + $key) }
    $currentFileForm = ConvertTo-JsonEscaped $entry.fullEntry
    $newFileForm = ConvertTo-JsonEscaped $t.NewFullEntry
    $occurrences = ([regex]::Matches($txt, [regex]::Escape($currentFileForm))).Count
    if ($occurrences -ne 1) {
        throw ('Uniqueness failed for ' + $key + ': ' + $occurrences)
    }
    $txt = $txt.Replace($currentFileForm, $newFileForm)
    Write-Host ('  [OK] fullEntry: ' + $key + ' (' + $currentFileForm.Length + ' -> ' + $newFileForm.Length + ' chars)')
}

# === STEP 2: Add relatedTerms ===
$parsed2 = $txt | ConvertFrom-Json
foreach ($t in $targets) {
    $key = $t.Key
    $newTerms = $t.NewRelatedTerms
    if (-not $newTerms -or $newTerms.Count -eq 0) { continue }
    $entry = $parsed2.$key
    $existing = @($entry.relatedTerms)
    $toAdd = $newTerms | Where-Object { $existing -notcontains $_ }
    if ($toAdd.Count -eq 0) {
        Write-Host ('  [SKIP rt] ' + $key + ': all present')
        continue
    }
    $pattern = '(?m)^\s*"' + [regex]::Escape($key) + '":\s*\{'
    $entryMatch = [regex]::Match($txt, $pattern)
    $entryIdx = $entryMatch.Index
    $rtIdx = $txt.IndexOf('"relatedTerms"', $entryIdx)
    $bracketOpen = $txt.IndexOf('[', $rtIdx)
    $bracketClose = $txt.IndexOf(']', $bracketOpen)
    $lastNl = $txt.LastIndexOf("`n", $bracketClose - 1)
    $secondLastNl = $txt.LastIndexOf("`n", $lastNl - 1)
    if ($secondLastNl -lt $bracketOpen) { throw ('Single-line array for ' + $key) }
    $itemLineStart = $secondLastNl + 1
    $lastItemLine = $txt.Substring($itemLineStart, $lastNl - $itemLineStart)
    $itemIndent = ([regex]::Match($lastItemLine, '^\s*')).Value
    $itemContent = $lastItemLine.Trim()
    $newItemsBlock = ($toAdd | ForEach-Object { ($itemIndent + '"' + $_ + '"') }) -join ",`n"
    $replacement = $itemIndent + $itemContent + ",`n" + $newItemsBlock
    $oldText = $itemIndent + $itemContent
    $txt = $txt.Remove($itemLineStart, $oldText.Length).Insert($itemLineStart, $replacement)
    Write-Host ('  [OK] relatedTerms added to ' + $key + ': ' + ($toAdd -join ', '))
}

# === STEP 3: Write temp + validate ===
[System.IO.File]::WriteAllText($tempPath, $txt)
Write-Host ''
Write-Host ('Wrote temp: ' + $tempPath + ' (' + (Get-Item $tempPath).Length + ' bytes)')
try {
    $parsed3 = Get-Content -Raw -LiteralPath $tempPath | ConvertFrom-Json
    $count = ($parsed3.PSObject.Properties | Measure-Object).Count
    Write-Host ('Parse OK. Entries: ' + $count + ' (expect 314)')
    if ($count -ne 314) { throw ('count mismatch') }
    foreach ($t in $targets) {
        $key = $t.Key
        $e = $parsed3.$key
        $hasNew = $e.fullEntry.Contains($t.NewFullEntry.Substring(0, 50))
        Write-Host ('  ' + $key + ': new=' + $hasNew + ', rt count=' + (@($e.relatedTerms)).Count)
    }
    $badKeys = @('SyncRoot','Count','Length','LongLength','Rank','IsReadOnly','IsFixedSize','IsSynchronized')
    $leaks = $badKeys | Where-Object { $parsed3.PSObject.Properties.Name -contains $_ }
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
