"""P12 preparation: read-only audit of authored defense data. Writes JSON to the given
path (keep it outside Git). Usage: python verification/p12/defense_data_audit.py OUT.json"""
import json, re, sys, collections, pathlib
root = pathlib.Path(__file__).resolve().parents[2]
src = root / 'src'
CATEGORY = {'CLOTH': 'd4', 'LEATHER': 'd6', 'MAIL': 'd8', 'PLATE': 'd10'}            # rules.json "Armor Category Damage Reduction Dice"
QUALITY = {'poor': 'd4', 'common': 'd6', 'uncommon': 'd8', 'rare': 'd10', 'epic': 'd12', 'legendary': 'd12', 'artifact': 'd20'}  # item wizards
TIERS_RES, TIERS_VUL = {25, 50, 100}, {25, 50, 100}                                # rules.json Damage Modifiers

def enclosing_object(text, at):
    i, depth = at, 0
    while i > 0:
        if text[i] == '}': depth += 1
        elif text[i] == '{':
            if depth == 0: break
            depth -= 1
        i -= 1
    j, depth = at, 0
    while j < len(text):
        if text[j] == '{': depth += 1
        elif text[j] == '}':
            if depth == 0: break
            depth -= 1
        j += 1
    return text[i:j + 1]

def field(obj, key):
    m = re.search(key + r":\s*['\"]([^'\"]+)['\"]", obj)
    return m.group(1) if m else None

items, seen = [], set()
for f in sorted((src / 'data/items').rglob('*.js')) + [src / 'store/characterSlices/coreSlice.js']:
    text = f.read_text(encoding='utf-8', errors='ignore')
    for m in re.finditer(r"maxDurability:\s*['\"](d\d+)['\"]", text):
        o = enclosing_object(text, m.start())
        kind, sub = field(o, 'type'), (field(o, 'subtype') or '').upper()
        if kind != 'armor' and sub != 'SHIELD': continue
        key = (str(f.relative_to(root)), field(o, 'id'), m.start())
        if key in seen: continue
        seen.add(key)
        listed, quality = m.group(1), (field(o, 'quality') or '').lower()
        items.append({'file': key[0], 'id': field(o, 'id'), 'name': field(o, 'name'), 'type': kind, 'subtype': sub,
                      'quality': quality, 'listedDie': listed, 'categoryDie': CATEGORY.get(sub), 'qualityDie': QUALITY.get(quality),
                      'agreesCategory': CATEGORY.get(sub) == listed, 'agreesQuality': QUALITY.get(quality) == listed})

creatures = json.loads((root / 'public/data/creatures.json').read_text(encoding='utf-8'))
off_tier = []
for c in creatures:
    for kind, table, tiers in (('resistance', c.get('resistances') or {}, TIERS_RES), ('vulnerability', c.get('vulnerabilities') or {}, TIERS_VUL)):
        for element, value in table.items():
            if value not in tiers: off_tier.append({'creature': c['id'], 'name': c.get('name'), 'kind': kind, 'element': element, 'value': value})
flat_dr_fields = sorted({k for c in creatures for k in (c.get('stats') or {}) if re.search(r'dr|reduction|armor', k, re.I)})

tables = (src / 'constants/weaponTypeSimpleTables.js').read_text(encoding='utf-8')
obsolete = [{'line': n + 1, 'text': line.strip()[:220]} for n, line in enumerate(tables.splitlines())
            if re.search(r"\bAC\b|Armor Class|to hit\b|to-hit", line) and not line.strip().startswith('*')]

evasion_fields = []
for f in (src / 'data').rglob('*.js'):
    for m in re.finditer(r"\bevasion['\"]?\s*:", f.read_text(encoding='utf-8', errors='ignore'), re.I):
        evasion_fields.append(str(f.relative_to(root)))

abilities = json.loads((root / 'public/data/abilities.json').read_text(encoding='utf-8'))
defensive_re = re.compile(r'(resist|immune|immunity|reduced|reduces? (all )?damage|vulnerab|damage reduction|\bDR\b|absorb|evasion|evade|miss chance|pass through|deflect)', re.I)
defensive_prose, formula_kinds = [], collections.Counter()
for cid, entries in abilities.items():
    for a in entries:
        text = a.get('description', '') + ' ' + ' '.join(e.get('description', '') for e in (a.get('buffConfig') or {}).get('effects', []) if isinstance(e, dict))
        if defensive_re.search(text):
            defensive_prose.append({'creature': cid, 'ability': a['id'], 'spellType': a.get('spellType'), 'text': text.strip()[:240]})
        formula = (a.get('damageConfig') or {}).get('formula')
        if formula:
            count = sum(int(n or 1) for n, _ in re.findall(r'(\d*)d(\d+)', formula))
            formula_kinds['single die' if count == 1 else ('multi-die' if count > 1 else 'no dice')] += 1
inline_to_hit = sum(1 for c in creatures for a in (c.get('abilities') or []) if re.search(r'to hit', a.get('description', ''), re.I))

summary = {
    'armorItems': len(items),
    'armorAgreement': collections.Counter(f"category:{'same' if i['agreesCategory'] else ('none' if not i['categoryDie'] else 'diff')}"
                                          f"/quality:{'same' if i['agreesQuality'] else ('none' if not i['qualityDie'] else 'diff')}" for i in items),
    'creatures': len(creatures), 'offTierModifiers': len(off_tier),
    'offTierValues': collections.Counter(f"{o['kind']} {o['value']}%" for o in off_tier),
    'creatureFlatDrFields': flat_dr_fields, 'structuredEvasionFields': sorted(set(evasion_fields)),
    'obsoleteWeaponFaces': len(obsolete),
    'creatureDefensiveProse': {'abilities': len(defensive_prose), 'creatures': len({d['creature'] for d in defensive_prose})},
    'creatureDamageFormulas': formula_kinds, 'inlineCreatureToHitTexts': inline_to_hit,
    'homebrewEncodings': {'creatureWizard': 'percent taken (100 normal, 50 Resistant, 25 Highly Resistant, 0 Immune, >100 increased, <0 heals)', 'library': 'percent reduced / percent added', 'campaignHomebrew': 'free text'}
}
out = {'summary': summary, 'armorItems': items, 'offTierModifiers': off_tier, 'obsoleteWeaponFaces': obsolete, 'defensiveProse': defensive_prose}
pathlib.Path(sys.argv[1]).write_text(json.dumps(out, indent=2), encoding='utf-8')
print(json.dumps(summary, indent=2))
