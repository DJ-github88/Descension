"""
Script to organize all loose icons in the main directory and empty the Misc folder
"""

import shutil
from pathlib import Path
from typing import Dict, List, Tuple

base_dir = Path(r"D:\DnD2\vtt-react\public\assets\icons\items\Misc\Profession Resources")
misc_dir = base_dir / "Misc"

def categorize_file(filename: str) -> str:
    """Determine category for a file based on its name."""
    filename_lower = filename.lower()
    
    # Ore and mining-related
    if any(keyword in filename_lower for keyword in ["ore", "nugget", "rock-ore", "mining", "deposit"]):
        return "Mining"
    
    # Gems and crystals
    elif any(keyword in filename_lower for keyword in ["gem", "crystal", "diamond", "ruby", "sapphire", "emerald"]):
        return "Gems"
    
    # Gold, ingots, bars -> Blacksmithing
    elif any(keyword in filename_lower for keyword in ["gold", "ingot", "bar-ingot", "nuggets-cluster"]):
        return "Blacksmithing"
    
    # Herbs, seeds, plants
    elif any(keyword in filename_lower for keyword in ["herb", "seed", "berry", "ginger", "turmeric", "root", "plant"]):
        return "Herbs"
    
    # Food items
    elif any(keyword in filename_lower for keyword in ["waffle", "popcorn", "food", "cooked"]):
        return "Food"
    
    # Maps and documents -> Enchanting or Misc
    elif any(keyword in filename_lower for keyword in ["map", "parchment", "document", "paper"]):
        return "Enchanting"
    
    # Fire, flame, lava, ember -> Enchanting
    elif any(keyword in filename_lower for keyword in ["fire", "flame", "lava", "ember", "magma"]):
        return "Enchanting"
    
    # Dirt, soil, sand, piles -> Farming
    elif any(keyword in filename_lower for keyword in ["dirt", "soil", "sand", "pile-", "mound", "gravel", "flour"]):
        return "Farming"
    
    # Wood, wooden, rod, bundle-wood -> Woodworking
    elif any(keyword in filename_lower for keyword in ["wood", "wooden", "rod-textured", "bundle-wood", "shovel-wooden"]):
        return "Woodworking"
    
    # Fabric, leather, spotted-fabric -> Tailoring
    elif any(keyword in filename_lower for keyword in ["fabric", "leather", "spotted-fabric"]):
        return "Tailoring"
    
    # Tools like shovel -> Farming
    elif any(keyword in filename_lower for keyword in ["shovel"]):
        return "Farming"
    
    # Horseshoe, metallic items -> Blacksmithing
    elif any(keyword in filename_lower for keyword in ["horseshoe", "metallic"]):
        return "Blacksmithing"
    
    # Bones -> Archaeology
    elif any(keyword in filename_lower for keyword in ["bone", "bones"]):
        return "Archaeology"
    
    # Ice, water, teardrop-water -> Enchanting or Misc
    elif any(keyword in filename_lower for keyword in ["ice", "water", "teardrop-water"]):
        return "Enchanting"
    
    # Everything else stays in Misc
    else:
        return "Misc"

def organize_misc_folder():
    """Move all remaining icons from Misc folder to appropriate categories."""
    if not misc_dir.exists():
        print("Misc folder not found or already empty")
        return 0
    
    icons = list(misc_dir.glob("*.png"))
    if not icons:
        print("Misc folder is already empty")
        return 0
    
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
        else:
            # If it should stay in Misc, we'll move it to main directory
            target_path = base_dir / icon.name
            moves.append({
                "source": icon,
                "target": target_path,
                "category": "main directory"
            })
    
    if moves:
        print(f"Moving {len(moves)} icons from Misc folder:")
        for move in moves:
            try:
                shutil.move(str(move['source']), str(move['target']))
                print(f"✓ {move['source'].name} -> {move['category']}/")
            except Exception as e:
                print(f"⚠️  Error moving {move['source'].name}: {e}")
        
        # Try to remove Misc folder if empty
        try:
            if not list(misc_dir.glob("*")):
                misc_dir.rmdir()
                print(f"\n✓ Removed empty Misc folder")
        except:
            pass
    
    return len(moves)

def organize_loose_icons():
    """Organize all loose icons in the main directory."""
    icons = [f for f in base_dir.glob("*.png") if f.is_file()]
    
    if not icons:
        print("No loose icons in main directory")
        return 0
    
    print(f"\nFound {len(icons)} loose icons in main directory\n")
    
    moves = []
    for icon in icons:
        category = categorize_file(icon.name)
        if category != "Misc":
            target_dir = base_dir / category
            target_dir.mkdir(exist_ok=True)
            target_path = target_dir / icon.name
            
            # Check if target already exists
            if target_path.exists():
                # Add number suffix
                stem = icon.stem
                counter = 1
                while target_path.exists():
                    target_path = target_dir / f"{stem}_{counter}.png"
                    counter += 1
            
            moves.append({
                "source": icon,
                "target": target_path,
                "category": category
            })
        else:
            # Create Misc folder if needed and keep there
            misc_dir.mkdir(exist_ok=True)
            target_path = misc_dir / icon.name
            moves.append({
                "source": icon,
                "target": target_path,
                "category": "Misc"
            })
    
    if moves:
        print(f"Organizing {len(moves)} loose icons:")
        for move in moves:
            try:
                shutil.move(str(move['source']), str(move['target']))
                print(f"✓ {move['source'].name} -> {move['category']}/")
            except Exception as e:
                print(f"⚠️  Error moving {move['source'].name}: {e}")
    
    return len(moves)

if __name__ == "__main__":
    print("=" * 60)
    print("Organizing Profession Resources Icons")
    print("=" * 60)
    
    # First, empty Misc folder
    misc_moved = organize_misc_folder()
    
    # Then organize loose icons
    loose_moved = organize_loose_icons()
    
    print("\n" + "=" * 60)
    print(f"Summary: Moved {misc_moved} icons from Misc, organized {loose_moved} loose icons")
    print("=" * 60)

