# Enrich 5 major Wyrd creature fullEntries + expand relatedTerms.
# Uses raw-text replacement (preserves file formatting); atomic write via temp file.

$ErrorActionPreference = 'Stop'
$path = 'D:\VTT\vtt-react\public\data\lore.json'
$tempPath = $path + '.prose-tmp'
$txt = [System.IO.File]::ReadAllText($path)

# Helper: convert a normal string (with actual ' and em-dash chars) to its JSON-file escaped form.
# Matches the existing convention: \u0027 for apostrophe, \u2014 for em-dash, \n for newlines.
function ConvertTo-JsonEscaped {
    param([string]$s)
    # First escape backslashes (none expected), then quotes, then specific chars.
    # Order matters: do backslash first if any.
    $s = $s -replace '\\', '\\'   # escape backslashes (none expected but safe)
    $s = $s -replace '"', '\"'    # escape double quotes
    $s = $s -replace "'", '\u0027'   # apostrophe -> \u0027 (matches existing convention)
    $emDash = [char]0x2014
    $s = $s -replace [regex]::Escape($emDash), '\u2014'   # em-dash -> \u2014
    # Replace literal newlines with \n escape
    $s = $s -replace "`r`n", '\n'
    $s = $s -replace "`n", '\n'
    return $s
}

# Define the 5 enrichment targets.
# Each entry: key, newFullEntry (normal text with apostrophes and em-dashes), newRelatedTerms (array of terms to ADD)
$targets = @(
    @{
        Key = 'husque'
        NewFullEntry = @"
The Wyrd is patient, but in the deep sulfur mines of Sundale, where the volcanic vents breathe close to the sealed vault, it has weight. The Husque is what that weight looks like when it finds a shape. It wears a body of basalt plates and floating copper veins held together by a gravity that bends inward instead of down, and inside the basalt shell is nothing — a moving rip in the world, a fingertip of Keth-Amar's hunger pressed through the seal and given legs.

It eats the gravity around it. Pebbles drift up. Weapons tear themselves from holsters and fly toward the chest where the void is deepest. Miners who see a Husque in a shaft have one choice: drop anything metal and run, because what the Husque cannot eat it will drag in, and what it eats is gone — not killed, gone, folded into the nothing that wears the basalt. When a Husque falls it collapses into a harmless heap of slag, but the spatial tear it leaves behind closes slowly, and the air that bleeds through it tastes of somewhere else. The Pyrofiends say the Husque is what slips out whenever Scathrach shifts in the vent below. The Augurs say it has nothing to do with Scathrach. Both of them send parties to close the tears anyway.
"@
        NewRelatedTerms = @('keth_amar','scathrach','pyrofiend','augur','sundale')
    },
    @{
        Key = 'the_cinder'
        NewFullEntry = @"
The Solari tell their children stories about the children who went into the volcanic rifts and never came back, and the stories always end the same way: the rifts gave them back. The Cinder is what came back. It is small, the size and shape of a child, but made of white-hot charcoal and glowing ash, and it speaks in a crackle that sounds like dry wood catching fire. Where it walks, the basalt melts behind it.

The Cinder can smell a spoken lie the way a wolf smells blood, and once it catches the scent, nothing else matters — not the battle around it, not the fire-vulnerability of its own ash flesh, not the bargains you offer. It goes for the liar. The Ash-Dwellers say the Cinder is the harsh face of Sol's judgment on a people who broke the world with their bargains and called it salvation. Most Solari assume it hunts their enemies. The wiser Solari know better. The wiser ones do not lie, and they do not let their children near the rifts.
"@
        NewRelatedTerms = @('solari','sundale','emberspire')
    },
    @{
        Key = 'skreika'
        NewFullEntry = @"
The Skaldic clans burn their dead at sea when they can, because the sea is jealous and the cold remembers what it takes. The Skreika are what the cold gives back when the burning is forgotten or the body sinks before the fire can take. They are blue-skinned, bloated, draped in frost and the seaweed they died in, and they speak in a choke of black water that freezes on the air. Walk into a Skreika's chill and the temperature drops twenty degrees in a heartbeat; the torches gutter; the breath crystallizes.

They wander the frozen bays in small silent packs, hunting for warmth to kill — a hearth, a lantern, the body-heat of the living. They are not mindless. Some of them still remember their ship duties: one will haul at a rope that isn't there, another will call a watch that ended a century ago, and the worst of them will weep a name before they go back to drowning whatever warmth they have found. The Skalds say a Skreika cannot be killed, only paused; chop one down and the next freeze-thaw will set it back on the ice, still looking for the ship that left without it.
"@
        NewRelatedTerms = @('house_skalvyr','skald','nordhalla','iceheart-sea')
    },
    @{
        Key = 'the_revel'
        NewFullEntry = @"
Before the fog, before the Breach, the deep ironwood groves rang with the music of the fae courts when the seasons turned. The Revel is what is left of that music when the Wyrd got into it. It comes in moonlit clearings, a phantom court of wood-carved puppets in painted masks that turn and turn around a cold bonfire that throws no heat. The air smells of sweet wine and damp earth and something underneath both that you do not want to name. And there is music. You will hear it before you see the clearing, and the music is the trap.

Those who step into the circle are caught. The melody enters the bones and the body begins to dance, and the dance does not stop until the lungs collapse or the heart tears itself apart. The puppets will not let you leave; they are hollow, filled with writhing black thorns that lash out when damaged, and they will drag you back into the ring with smiles carved on their wooden faces. The Florae know the clearings where the Revel walks, and they will not enter them even by day. Walk the moonlit groves alone and you may hear the music. Walk toward it and you join the court forever.
"@
        NewRelatedTerms = @('briaran','frostwood-reach','grimmwood','ironwood_heart')
    },
    @{
        Key = 'ash_woven_oracle'
        NewFullEntry = @"
The Augurs listen to Aex's scream and try to read Sol's pulse, and they tell themselves they are the only prophets left in Sundale. The Ash-Woven Oracle is the other one. It drifts faceless through the sulfur vents and the badland shrines, a floating drape of compacted volcanic ash held together by the Wyrd currents that pool in the warm places of the caldera. It carries a bowl of liquid lava the way a mendicant carries a begging bowl, and from the place where its face should be, it speaks.

The Oracle's prophecies are always the same prophecy, told in fragments: the caldera will freeze, the vents will close, the forges will go cold, and the last generation will starve in the dark. The soot it sheds as it speaks is toxic; miners who breathe it scar inside their lungs and never quite recover. Most Solari leave it alone. The Pyrofiends listen, because the Oracle's prophecy is the same one Scathrach whispers up from the deep vents, and the Pyrofiends know the difference between a warning and a promise. Find an Ash-Woven Oracle in the badlands and the only safe answer is to back away slowly. It does not pursue. It does not have to. It will out-wait you, and the caldera is cooling a degree at a time.
"@
        NewRelatedTerms = @('augur','scathrach','pyrofiend','solari','sundale','aex')
    }
)

# === STEP 1: Replace each fullEntry ===
$parsed = $txt | ConvertFrom-Json

foreach ($t in $targets) {
    $key = $t.Key
    $entry = $parsed.$key
    if (-not $entry) { throw ('Entry not found: ' + $key) }

    # Current fullEntry content (parsed form, has actual ' and em-dash chars)
    $currentFullEntryParsed = $entry.fullEntry
    if (-not $currentFullEntryParsed) { throw ('No fullEntry for: ' + $key) }

    # Convert current to FILE-form (escaped) for searching
    $currentFileForm = ConvertTo-JsonEscaped $currentFullEntryParsed

    # Convert new content to FILE-form
    $newFileForm = ConvertTo-JsonEscaped $t.NewFullEntry

    # Verify the current FILE-form exists exactly once in the file
    $occurrences = ([regex]::Matches($txt, [regex]::Escape($currentFileForm))).Count
    if ($occurrences -ne 1) {
        Write-Host ('UNIQUENESS FAILED for ' + $key + ': found ' + $occurrences + ' occurrences')
        Write-Host ('  Searching for (first 100 chars): ' + $currentFileForm.Substring(0, [Math]::Min(100, $currentFileForm.Length)))
        throw ('Cannot uniquely identify current fullEntry for ' + $key)
    }

    # Replace
    $txt = $txt.Replace($currentFileForm, $newFileForm)
    Write-Host ('  [OK] fullEntry replaced: ' + $key + ' (' + $currentFileForm.Length + ' -> ' + $newFileForm.Length + ' chars)')
}

# === STEP 2: Add new relatedTerms ===
# Re-parse after the fullEntry changes to get fresh state
$txtBeforeRT = $txt
$parsed2 = $txt | ConvertFrom-Json

foreach ($t in $targets) {
    $key = $t.Key
    $newTerms = $t.NewRelatedTerms
    if (-not $newTerms -or $newTerms.Count -eq 0) { continue }

    $entry = $parsed2.$key
    if (-not $entry) { throw ('Entry not found for relatedTerms: ' + $key) }

    $existing = @($entry.relatedTerms)
    $toAdd = $newTerms | Where-Object { $existing -notcontains $_ }
    if ($toAdd.Count -eq 0) {
        Write-Host ('  [SKIP] ' + $key + ': all terms already present')
        continue
    }

    # Find the relatedTerms array in raw text and append.
    # Strategy: find the LAST existing item (unique enough since it's the current last element),
    # then append the new terms after it.

    # Locate the relatedTerms block for this entry
    $pattern = '(?m)^\s*"' + [regex]::Escape($key) + '":\s*\{'
    $entryMatch = [regex]::Match($txt, $pattern)
    if (-not $entryMatch.Success) { throw ('Cannot find entry key in raw text: ' + $key) }
    $entryIdx = $entryMatch.Index

    $rtIdx = $txt.IndexOf('"relatedTerms"', $entryIdx)
    if ($rtIdx -lt 0) { throw ('No relatedTerms in ' + $key) }
    $bracketOpen = $txt.IndexOf('[', $rtIdx)
    $bracketClose = $txt.IndexOf(']', $bracketOpen)
    if ($bracketClose -lt 0) { throw ('No closing ] for relatedTerms in ' + $key) }

    # Find the last item in the array (line before the closing ])
    $lastNl = $txt.LastIndexOf("`n", $bracketClose - 1)
    $secondLastNl = $txt.LastIndexOf("`n", $lastNl - 1)
    if ($secondLastNl -lt $bracketOpen) {
        throw ('Unexpected: only one newline between [ and ] for ' + $key)
    }
    $itemLineStart = $secondLastNl + 1
    $lastItemLine = $txt.Substring($itemLineStart, $lastNl - $itemLineStart)
    $wsMatch = [regex]::Match($lastItemLine, '^\s*')
    $itemIndent = $wsMatch.Value
    $itemContent = $lastItemLine.Trim()
    if (-not $itemContent) { throw ('Empty last item for ' + $key) }
    if ($itemContent.EndsWith(',')) { throw ('Last item already ends with comma for ' + $key) }

    # Build new items block
    $newItemsBlock = ($toAdd | ForEach-Object { ($itemIndent + '"' + $_ + '"') }) -join ",`n"
    $replacement = $itemIndent + $itemContent + ",`n" + $newItemsBlock
    $oldText = $itemIndent + $itemContent

    # Replace at the specific position
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
    if ($count -ne 314) { throw ('Entry count mismatch: ' + $count) }
    # Verify each target has new content
    foreach ($t in $targets) {
        $key = $t.Key
        $e = $parsed3.$key
        $hasNew = $e.fullEntry.Contains($t.NewFullEntry.Substring(0, 50))
        Write-Host ('  ' + $key + ': new fullEntry starts-with-50chars=' + $hasNew + ', relatedTerms count=' + (@($e.relatedTerms)).Count)
    }
    # Check no PS leaks
    $badKeys = @('SyncRoot','Count','Length','LongLength','Rank','IsReadOnly','IsFixedSize','IsSynchronized')
    $leaks = $badKeys | Where-Object { $parsed3.PSObject.Properties.Name -contains $_ }
    if ($leaks) { throw ('PS leaks: ' + $leaks) } else { Write-Host '  No PS leaks' }
} catch {
    Write-Host ('JSON INVALID: ' + $_)
    Write-Host ('Temp KEPT: ' + $tempPath)
    throw
}

# === STEP 4: Atomic replace ===
Move-Item -LiteralPath $tempPath -Destination $path -Force
Write-Host ''
Write-Host ('Replaced. Final MD5: ' + (Get-FileHash -LiteralPath $path -Algorithm MD5).Hash)
Write-Host '=== DONE ==='
