q = chr(39)

def replace_in_file(filepath, pairs):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    new_lines = []
    for line in lines:
        replaced = False
        for old, new in pairs:
            if new is None and old in line:
                replaced = True
                break
            elif new is not None and old in line:
                line = line.replace(old, new)
                replaced = True
                break
        if not replaced:
            new_lines.append(line)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

def rep(filepath, *args):
    replace_in_file(filepath, args)

base = r'D:\VTT\vtt-react\src'

rep(f'{base}/data/classSpellCategories.js',
    (f"'Fate Weaver': {{", f"'Gambit': {{"),
    (f"'Gambler': {{\n        path: 'Mercenary Path',\n", None))

rep(f'{base}/data/startingCurrencyData.js',
    (f"'Fate Weaver': {{ gold: 15 }},", f"'Gambit': {{ gold: 25 }}"),
    (f"'Gambler': {{ gold: 25 }},", None))

rep(f'{base}/data/summonableTokens.js',
    (f"'fate weaver': 'fateweaver'", f"'gambit': 'gambit'"),
    (f"'fateweaver': 'fateweaver'", None),
    (f"'gambler': 'gambler'", None))

rep(f'{base}/data/paths/mercenaryPath.js',
    ('Gambler classes.', 'Gambit classes.'))

rep(f'{base}/data/deepLocationData.js',
    ('augur, falseProphet, fateWeaver, gambler', 'augur, falseProphet, gambit'))

rep(f'{base}/data/spellTemplates.js',
    (f"'gambler': 'fortune'", f"'gambit': 'fortune'"),
    (f"'fateweaver': 'fortune'", None))

print('Batch 1 done')
