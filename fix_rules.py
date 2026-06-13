base = r'D:\VTT\vtt-react\src'
filepath = base + r'\data\rulesData.js'

c = open(filepath, 'r', encoding='utf-8').read()

c = c.replace('class-lore-name\">Gambler<', 'class-lore-name\">Gambit<')
c = c.replace('class-lore-role-badge\">Damage / Utility<', 'class-lore-role-badge\">Damage / Control<')
c = c.replace('chaotic Gambler)', 'chaotic Gambit)')
c = c.replace('for Gamblers.', 'for Gambits.')
c = c.replace('with a **Gambler** class.', 'with a **Gambit** class.')
c = c.replace('A **Gambler** bends probability', 'A **Gambit** bends probability')

# Replace the Fate Weaver class description line
c = c.replace('**Fate Weaver**: Destiny manipulator. Turns failures into power with card-based mechanics.', '**Gambit**: Probability manipulator. Fuses fortune-siphoning with precise cartomantic surgery, wielding both luck and destiny as weapons.')

# Remove the Gambler description line (now covered by Gambit above)
c = c.replace('- **Gambler**: Risk-taker. Manipulates luck and probability with Fortune Points.\n', '')

open(filepath, 'w', encoding='utf-8').write(c)
print('Done')
