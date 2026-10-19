export const ALL_BACKGROUND_ASSETS = [
    'CrystalCave.png', 'DenseForest.png', 'DesertTemple.png', 'Embers.png', 'Flowers.png',
    'Forest1.png', 'Forest2.png', 'Forest3.png', 'Forest4.png', 'Frost.png',
    'FrozTemple.png', 'GloomyCave.png', 'HazyCave.png', 'MountainDesert.png', 'MountainFrost.png',
    'MountainIce.png', 'MountainSky.png', 'NightFrost.png', 'OpenForest.png', 'Sky.png',
    'Smoke.png', 'Spikey Cave.png', 'Stonehedge.png', 'Temple.png', 'Volcano Lake.png',
    'Volcano.png', 'mountains1.png', 'mountains2.png', 'mountains3.png', 'mountains4.png'
];

export const getBackgroundUrl = (bgName) => `/assets/backgrounds/${bgName}`;

export const ORIGIN_ILLUSTRATIONS = {
    peakTracker: {
        src: '/assets/images/origins/peakTracker.jpg',
        caption: 'Cragjaw Mountaineer — High-altitude ascent gear and bivouac camp above the Cragjaw Peaks'
    },
    merrowSailor: {
        src: '/assets/images/origins/merrowSailor.jpg',
        caption: 'Iceheart Sea Mariner — Rigging tackle, box compass, and luck-ledger coin on the storm-tossed gunwale'
    },
    emberspirePilgrim: {
        src: '/assets/images/origins/emberspirePilgrim.jpg',
        caption: "Emberspire Sun-Pilgrim — Sealed Sol's Breath solar phial and basalt rosary upon volcanic escarpment"
    },
    zenithCartographer: {
        src: '/assets/images/origins/zenithCartographer.jpg',
        caption: 'Sundrift Zenith Cartographer — Armillary astrolabe and celestial charts overlooking the star crater'
    },
    sanctuarySeneschal: {
        src: '/assets/images/origins/sanctuarySeneschal.jpg',
        caption: 'Bryngloom Sanctuary Seneschal — Camphor censer, herbal mortar, and surgical scalpels in the wetlands'
    },
    shyrRunner: {
        src: '/assets/images/origins/shyrRunner.jpg',
        caption: 'Sundale Ash Runner — Cinder goggles, sealed copper dispatch cylinder, and spikes over the black dunes'
    },
    ledgerKeeper: {
        src: '/assets/images/origins/ledgerKeeper.jpg',
        caption: 'Frostwood Ledger Keeper — Ironwood journal, peat inkpot, and raven quill within the living memory fog'
    },
    gloomwayTrader: {
        src: '/assets/images/origins/gloomwayTrader.jpg',
        caption: 'Bryngloom Smuggler — Brass balance scale, violet memory-glass crystals, and false-bottom ledger'
    },
    chasmDelver: {
        src: '/assets/images/origins/chasmDelver.jpg',
        caption: 'Cragjaw Chasm Delver — Geothermal pressure lantern, pipe-wrench, and steam-goggles in volcanic deeps'
    },
    monolithHunter: {
        src: '/assets/images/origins/monolithHunter.jpg',
        caption: 'Monolith Relic Hunter — Wyrd-lens, cold-iron rune stakes, and glyph field journal by the ancient obelisk'
    },
    groveWarden: {
        src: '/assets/images/origins/groveWarden.jpg',
        caption: 'Viridane Grove Warden — Tree-crest medallion, pruning billhook, and fae-contract bone tally in moonlit grove'
    },
    maskWarden: {
        src: '/assets/images/origins/maskWarden.jpg',
        caption: 'Mimir Mask Warden — Porcelain antler-mask shard, storm-whistle, and spore-trail phials among ancient ruins'
    },
    herdGuardian: {
        src: '/assets/images/origins/herdGuardian.jpg',
        caption: 'Sundrift Herd Guardian — Ironwood crook, braided lariat, and shag-ox wool wraps over golden steppes'
    },
    glacierHarpooner: {
        src: '/assets/images/origins/glacierHarpooner.jpg',
        caption: 'Nordhalla Glacier Harpooner — Barbed bone harpoon, spiked crampons, and mammoth-bone goggles on sea-ice'
    },
    deepCurrentGuide: {
        src: '/assets/images/origins/deepCurrentGuide.jpg',
        caption: 'Deep Current Guide — Myrathil depth-dial, bioluminescent sea-lure orb, and coral needles in emerald abyss'
    },
    spanBuilder: {
        src: '/assets/images/origins/spanBuilder.jpg',
        caption: 'Groven Span Builder — Ivory resonance-rod, stone chisels, and iron grapnel hook above the Ancestor-Span'
    },
    craterVanguard: {
        src: '/assets/images/origins/craterVanguard.jpg',
        caption: 'Sundrift Crater Vanguard — Brass spyglass, glowing meteorite core, and inclinometer by the Star-Crater'
    },
    frostChanter: {
        src: '/assets/images/origins/frostChanter.jpg',
        caption: 'Nordhalla Frost Chanter — Sacred story-drum, runic knotwork token, and wolf-fur cloak by the hearth'
    },
    keepWarden: {
        src: '/assets/images/origins/keepWarden.jpg',
        caption: 'Mountain Keep Warden — Silent watch-bell, frost gauge, keep signet, and ration tally on snowy battlements'
    },
    forgeWright: {
        src: '/assets/images/origins/forgeWright.jpg',
        caption: 'Forge Wright — Smithing hammer, leather apron, metal alloy ring, and sealed guild letter by the roaring hearth'
    },
    ashDuneSkimmer: {
        src: '/assets/images/origins/ashDuneSkimmer.jpg',
        caption: 'Sundale Ash Skimmer — Obsidian sand-goggles, wooden sled-skis, bone salvage hook, and yellow dust scarf'
    },
    brineTrader: {
        src: '/assets/images/origins/brineTrader.jpg',
        caption: 'Iceheart Brine Trader — Brass-bound trade ledger, syndicate seal ring, bone dice, and blue sea-silk cord'
    },
    fogReader: {
        src: '/assets/images/origins/fogReader.jpg',
        caption: 'Frostwood Fog Reader — Bone fog-ward compass, glowing spider-silk cord, and soot-resin ink in memory mist'
    },
    shantyRat: {
        src: '/assets/images/origins/shantyRat.jpg',
        caption: 'Over-Shanty Urchin — Iron grappling hook, bone-handled shiv, stolen signet ring, and lockpicks over the abyss'
    },
    clockworkHorologist: {
        src: '/assets/images/origins/clockworkHorologist.jpg',
        caption: 'Fex Clockmaker — Skeleton pocket chronometer, loupe, tweezers, and calipers in subterranean clockwork hall'
    },
    synodAcademic: {
        src: '/assets/images/origins/synodAcademic.jpg',
        caption: 'Synod Academic — Carved bone Steppe-Staff, violet memory-glass crystals, and star-charts above singing canyon'
    },
    bloodlineHeir: {
        src: '/assets/images/origins/bloodlineHeir.jpg',
        caption: 'Bloodline Heir — Heraldic lion signet, damascus dueling dagger, and lineage vellum in high gothic council hall'
    },
    vitriolProspector: {
        src: '/assets/images/origins/vitriolProspector.jpg',
        caption: 'Vitriol Prospector — Lead crucible, leather respirator, and copper tongs by boiling turquoise acid sumps'
    },
    cataractScout: {
        src: '/assets/images/origins/cataractScout.jpg',
        caption: 'Cataract Pathfinder — Birchwood rune paddle, river charts, and bone fillet knife by roaring whitewater rapids'
    },
    steppeSinger: {
        src: '/assets/images/origins/steppeSinger.jpg',
        caption: 'Ordu Steppe Singer — Two-stringed horse-head lute, rawhide lariat, and sheepskin cloak over sunset steppes'
    },
    canopyWeaver: {
        src: '/assets/images/origins/canopyWeaver.jpg',
        caption: 'Viridane Canopy Weaver — Pruning billhook, wicker orchid basket, silver wire, and bone shears in treetop gardens'
    },
    vaultTender: {
        src: '/assets/images/origins/vaultTender.jpg',
        caption: 'Emberspire Vault Tender — Obsidian temperature probe, copper tongs, and quench phials in volcanic catacombs'
    },
    saltHingeEnvoy: {
        src: '/assets/images/origins/saltHingeEnvoy.jpg',
        caption: 'Salt-Hinge Harbor Envoy — Treaty cylinder, salt balance scale, and tariff tokens above limestone boom-cranes'
    },
    trenchListener: {
        src: '/assets/images/origins/trenchListener.jpg',
        caption: 'Treakous Trench Listener — Acoustic resonator horn, sounding line, and seismic ledger in abyssal rift'
    },
    nullSaltHunter: {
        src: '/assets/images/origins/nullSaltHunter.jpg',
        caption: 'Root-Veil Null-Salt Hunter — Violet null-salt crystals, ironwood recurve bow, and awl in glowing fungal swamp'
    },
    vaultScholar: {
        src: '/assets/images/origins/vaultScholar.jpg',
        caption: 'Fex Guild-Vault Machinist — Engraved copper-plate codex, tinker calipers, and blueprints in subterranean clockwork vault'
    },
    privateer: {
        src: '/assets/images/origins/privateer.jpg',
        caption: 'Iceheart Privateer — Water-stained letter-of-marque, boarding axe, and sea-chart before glacial icebergs and corsair caravel'
    },
    sumpsVeteran: {
        src: '/assets/images/origins/sumpsVeteran.jpg',
        caption: 'Bloodhammer Sump Veteran — Lava-forged rank insignia, geothermal pressure gauge, and trophy clasp in glacial volcanic trenches'
    },
    greymarkArchivist: {
        src: '/assets/images/origins/greymarkArchivist.jpg',
        caption: 'Greymark Archivist — Lineage-tapestry cloth swatch, recording quill, bog-iron inkpot, and knotted index-cords overlooking misty Frostwood'
    },
    hushSurvivor: {
        src: '/assets/images/origins/hushSurvivor.jpg',
        caption: 'Bryngloom Hush Survivor — Mycelium-testing kit, amber sedative vials, and sealed field journal above bioluminescent bog waters'
    },
    nameless: {
        src: '/assets/images/origins/nameless.jpg',
        caption: 'Bryngloom Nameless Outcast — Forged papers, severance null-iron token, and forgery kit in misty root shanty'
    },
    debtNegotiator: {
        src: '/assets/images/origins/debtNegotiator.jpg',
        caption: 'Atropolis Debt Negotiator — Silver-leaf contract scroll case, brass balance scale, and seal wafers above canopy city'
    },
    obligationBroker: {
        src: '/assets/images/origins/obligationBroker.jpg',
        caption: 'Weft Obligation Broker — Knotted cord tally, carved fate-coins, and debt-knife in flooded root undercroft'
    },
    contractClerk: {
        src: '/assets/images/origins/contractClerk.jpg',
        caption: 'Atropolis Contract Clerk — Filing quill, bog-iron inkpot, and notary ledger before First Contract tree root vault'
    },
    starboundScholar: {
        src: '/assets/images/origins/starboundScholar.jpg',
        caption: 'Astril Starbound Scholar — Echo memory-glass shard, resonance bowl, and celestial bone chart under twilight sky'
    },
    cryptKeeper: {
        src: '/assets/images/origins/cryptKeeper.jpg',
        caption: 'Mycellan Crypt-Keeper — Teal ancestral-light lantern, bark ledger, and violet warding salts in subterranean crypt halls'
    },
    peatTender: {
        src: '/assets/images/origins/peatTender.jpg',
        caption: 'Morgh Quarry Mason — Granite chisel, stone maul, plumb-line, and hall-stone in colossal subterranean quarry'
    },
    petrifiedMason: {
        src: '/assets/images/origins/petrifiedMason.jpg',
        caption: 'Amordjin Span Tollkeeper — Span-toll ledger, stone-gauge caliper, and rune rubbing kit on petrified bridge over alpine abyss'
    },
    scriptureHerald: {
        src: '/assets/images/origins/scriptureHerald.jpg',
        caption: 'Arch Mimir Scripture Herald — Gold-lacquered scroll-case, silver quill, and genealogy parchment high above canopy fog'
    },
    quietTraded: {
        src: '/assets/images/origins/quietTraded.jpg',
        caption: 'Broken Mimir Scavenger — River-hook, pry bar, aerie salvage sack, and companion Mote vial on misty forest dock'
    },
    briarSentinel: {
        src: '/assets/images/origins/briarSentinel.jpg',
        caption: 'Oaken Forester Sentinel — Branch-staff, amber heartwood resin pot, and carving awl in living root-halls'
    },
    arbitrator: {
        src: '/assets/images/origins/arbitrator.jpg',
        caption: 'Atropolis Arbitrator — Memory-glass ruling slide, writ-case, and silver-leaf hearing ledgers before the First Contract'
    }
};

export const getOriginIllustration = (bgId) => ORIGIN_ILLUSTRATIONS[bgId] || null;
