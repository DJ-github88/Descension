"""
Script to organize icons in the Misc folder into more specific categories
"""

import shutil
from pathlib import Path
from typing import Dict, List

base_dir = Path(r"D:\DnD2\vtt-react\public\assets\icons\items\Misc\Profession Resources")
misc_dir = base_dir / "Misc"

# Define categorization rules based on filename patterns
categorization = {
    # Bones, Skulls, Fossils -> Archaeology
    "Archaeology": [
        "bone", "skull", "fossil", "jaw", "skeleton", "creature-skull", "reptilian-draconic"
    ],
    # Food items -> Food (new category)
    "Food": [
        "meat", "drumstick", "pizza", "cooked"
    ],
    # Currency/Coins -> Misc (keep in Misc)
    "Misc": [
        "gold-coins", "coins-pile", "currency"
    ],
    # Containers/Bags -> Misc (keep in Misc)
    "Misc": [
        "pouch", "bag", "satchel", "backpack", "sack"
    ],
    # Weapons/Tools -> Blacksmithing or Engineering
    "Blacksmithing": [
        "sword", "knife", "kukri", "blade", "weapon", "whip", "claw", "talon"
    ],
    # Organic/Monster parts -> Misc or create Monsters category
    "Misc": [
        "creature", "monster", "entity", "fish", "horn", "tusk", "scales", "hide"
    ],
    # Magical/Mystical -> Enchanting
    "Enchanting": [
        "fiery", "molten", "glowing", "magical", "spark", "lightning", "star-burst"
    ],
    # Containers/Vessels -> Misc
    "Misc": [
        "bowl", "pot", "jar", "urn", "basin"
    ],
    # Organic materials -> Herbs or Misc
    "Herbs": [
        "egg", "nest", "pebble", "root", "wood", "gnarled"
    ]
}

def categorize_file(filename: str) -> str:
    """Determine category for a file based on its name."""
    filename_lower = filename.lower()
    
    # Check each category
    if any(keyword in filename_lower for keyword in ["bone", "skull", "fossil", "jaw", "skeleton", "creature-skull", "reptilian"]):
        return "Archaeology"
    elif any(keyword in filename_lower for keyword in ["meat", "drumstick", "pizza", "cooked"]):
        return "Food"
    elif any(keyword in filename_lower for keyword in ["sword", "knife", "kukri", "blade", "weapon", "whip", "claw", "talon"]):
        return "Blacksmithing"
    elif any(keyword in filename_lower for keyword in ["fiery", "molten", "glowing", "spark", "lightning", "star-burst", "magical"]):
        return "Enchanting"
    elif any(keyword in filename_lower for keyword in ["egg", "nest", "pebble"]):
        return "Herbs"
    elif any(keyword in filename_lower for keyword in ["spaceship", "fighter"]):
        return "Engineering"
    else:
        return "Misc"  # Keep in Misc if no specific category matches

def organize_misc_icons():
    """Organize icons from Misc folder into appropriate categories."""
    if not misc_dir.exists():
        print(f"Misc folder not found: {misc_dir}")
        return
    
    icons = list(misc_dir.glob("*.png"))
    print(f"Found {len(icons)} icons in Misc folder\n")
    
    moves = []
    for icon in icons:
        category = categorize_file(icon.name)
        if category != "Misc":
            target_dir = base_dir / category
            target_dir.mkdir(exist_ok=True)
            target_path = target_dir / icon.name
            
            moves.append({
                "source": icon,
                "target": target_path,
                "category": category
            })
    
    # Show what will be moved
    print("Icons to be moved:")
    for move in moves:
        print(f"  {move['source'].name} -> {move['category']}/")
    
    if moves:
        print(f"\nMoving {len(moves)} icons...")
        for move in moves:
            try:
                shutil.move(str(move['source']), str(move['target']))
                print(f"✓ {move['source'].name} -> {move['category']}/")
            except Exception as e:
                print(f"⚠️  Error moving {move['source'].name}: {e}")
    else:
        print("\nNo icons need to be moved (all staying in Misc)")

if __name__ == "__main__":
    organize_misc_icons()

