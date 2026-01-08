"""
Script to intelligently sort icons within each subfolder of the abilities directory.
Groups related icons together (e.g., numbered variants, themed names).
"""

import re
import shutil
from pathlib import Path
from typing import List, Tuple

abilities_dir = Path(r"D:\DnD2\vtt-react\public\assets\icons\abilities")

def extract_base_name_and_number(filename: str) -> Tuple[str, int]:
    """
    Extract base name and number from filename.
    Returns (base_name, number) where number is 0 if no number found.
    Examples:
        "Dark Abyss 1.png" -> ("Dark Abyss", 1)
        "Dark Abyss.png" -> ("Dark Abyss", 0)
        "Rising Inferno 2.png" -> ("Rising Inferno", 2)
    """
    stem = Path(filename).stem  # Remove .png extension
    
    # Match pattern like "Name 1", "Name 2", etc.
    match = re.match(r'^(.+?)\s+(\d+)$', stem)
    if match:
        base_name = match.group(1)
        number = int(match.group(2))
        return (base_name, number)
    
    # No number found
    return (stem, 0)

def get_sort_key(filename: str) -> Tuple[str, int, str]:
    """
    Generate a sort key for a filename.
    Returns (base_name_lower, number, original_filename) for stable sorting.
    """
    base_name, number = extract_base_name_and_number(filename)
    return (base_name.lower(), number, filename)

def normalize_theme_name(name: str) -> str:
    """
    Normalize theme names to group similar themed icons together.
    For example, "Fiery", "Fire", "Flaming" should be grouped.
    """
    name_lower = name.lower()
    
    # Fire-related themes
    if any(theme in name_lower for theme in ['fiery', 'fire', 'flaming', 'flame', 'burning', 'scorching', 'inferno', 'ember']):
        return 'fire_theme'
    
    # Shadow/Dark themes
    if any(theme in name_lower for theme in ['shadow', 'dark', 'ebon', 'gloomy', 'shadowy']):
        return 'shadow_theme'
    
    # Light/Radiant themes
    if any(theme in name_lower for theme in ['radiant', 'glowing', 'light', 'bright', 'golden', 'celestial']):
        return 'light_theme'
    
    # Ice/Frost themes
    if any(theme in name_lower for theme in ['frost', 'ice', 'frozen', 'cold', 'freezing']):
        return 'ice_theme'
    
    # Lightning/Thunder themes
    if any(theme in name_lower for theme in ['lightning', 'thunder', 'electric', 'spark', 'bolt']):
        return 'lightning_theme'
    
    # Nature/Earth themes
    if any(theme in name_lower for theme in ['nature', 'earth', 'plant', 'root', 'vine', 'tree', 'leaf']):
        return 'nature_theme'
    
    # Necrotic/Death themes
    if any(theme in name_lower for theme in ['necrotic', 'death', 'skull', 'bone', 'undead', 'ghost']):
        return 'necrotic_theme'
    
    # Psychic/Mind themes
    if any(theme in name_lower for theme in ['psychic', 'mind', 'mental', 'telepathy', 'psionic']):
        return 'psychic_theme'
    
    # Healing themes
    if any(theme in name_lower for theme in ['healing', 'heal', 'health', 'heart', 'restore']):
        return 'healing_theme'
    
    # Utility/Movement themes
    if any(theme in name_lower for theme in ['dash', 'speed', 'movement', 'step', 'jump', 'leap', 'run']):
        return 'movement_theme'
    
    # Shield/Defense themes
    if any(theme in name_lower for theme in ['shield', 'defense', 'armor', 'protection', 'barrier']):
        return 'defense_theme'
    
    # Weapon/Attack themes
    if any(theme in name_lower for theme in ['strike', 'slash', 'punch', 'kick', 'attack', 'weapon', 'sword', 'axe', 'dagger']):
        return 'attack_theme'
    
    return 'other'

def get_advanced_sort_key(filename: str) -> Tuple[str, str, int, str]:
    """
    Generate an advanced sort key that groups by theme, then base name, then number.
    """
    base_name, number = extract_base_name_and_number(filename)
    theme = normalize_theme_name(base_name)
    return (theme, base_name.lower(), number, filename)

def sort_files_in_folder(folder_path: Path, use_theme_grouping: bool = True) -> List[Path]:
    """
    Sort files in a folder intelligently.
    Returns sorted list of file paths.
    """
    files = list(folder_path.glob("*.png"))
    
    if not files:
        return []
    
    if use_theme_grouping:
        # Use advanced sorting with theme grouping
        files.sort(key=lambda f: get_advanced_sort_key(f.name))
    else:
        # Use simple sorting by base name and number
        files.sort(key=lambda f: get_sort_key(f.name))
    
    return files

def reorganize_folder(folder_path: Path, dry_run: bool = False, add_prefixes: bool = False) -> Tuple[int, List[Tuple[str, str]]]:
    """
    Reorganize files in a folder by showing recommended order or optionally adding prefixes.
    
    Args:
        folder_path: Path to folder to reorganize
        dry_run: If True, only show what would be done
        add_prefixes: If True, add numeric prefixes to filenames (WARNING: breaks existing references)
    
    Returns:
        Tuple of (files_processed, list of (old_name, new_name) if prefixes added)
    """
    files = sort_files_in_folder(folder_path, use_theme_grouping=True)
    
    if not files:
        return (0, [])
    
    if dry_run or not add_prefixes:
        # Just show the recommended order
        print(f"\n  Recommended order for {len(files)} files in {folder_path.name}:")
        
        # Group by theme for better display
        current_theme = None
        for i, file in enumerate(files, 1):
            base_name, number = extract_base_name_and_number(file.name)
            theme = normalize_theme_name(base_name)
            
            if theme != current_theme and theme != 'other':
                theme_display = theme.replace('_theme', '').title()
                print(f"\n    [{theme_display} Theme]")
                current_theme = theme
            
            if number > 0:
                print(f"    {i:3d}. {file.name} (base: {base_name}, variant {number})")
            else:
                print(f"    {i:3d}. {file.name}")
        
        return (len(files), [])
    
    # Add prefixes (WARNING: this breaks existing code references!)
    print(f"\n  ⚠️  WARNING: Adding prefixes will break existing code references!")
    print(f"  Renaming {len(files)} files in {folder_path.name}...")
    
    renamed_files = []
    renamed_count = 0
    
    # Use temporary names first to avoid conflicts
    temp_files = []
    for i, file in enumerate(files, 1):
        prefix = f"{i:04d}"
        temp_name = f"__TEMP_{i:05d}__{file.name}"
        temp_path = folder_path / temp_name
        temp_files.append((file, temp_path, prefix))
    
    # Rename to temporary names
    for original, temp, prefix in temp_files:
        try:
            original.rename(temp)
        except Exception as e:
            print(f"    ⚠️  Error renaming {original.name} to temp: {e}")
            # Try to restore any already renamed files
            for orig, t, _ in temp_files:
                if t.exists():
                    try:
                        t.rename(orig)
                    except:
                        pass
            return (0, [])
    
    # Rename to final prefixed names
    for original, temp, prefix in temp_files:
        try:
            new_name = f"{prefix}_{original.name}"
            new_path = folder_path / new_name
            temp.rename(new_path)
            renamed_files.append((original.name, new_name))
            renamed_count += 1
        except Exception as e:
            print(f"    ⚠️  Error renaming {temp.name} to final: {e}")
            # Try to restore
            try:
                temp.rename(original)
            except:
                pass
    
    return (renamed_count, renamed_files)

def main(dry_run: bool = True, add_prefixes: bool = False):
    """
    Main function to organize all ability icon subfolders.
    
    Args:
        dry_run: If True, only show recommended order (default: True for safety)
        add_prefixes: If True, add numeric prefixes to filenames (WARNING: breaks references)
    """
    if not abilities_dir.exists():
        print(f"Abilities directory not found: {abilities_dir}")
        return
    
    subfolders = [d for d in abilities_dir.iterdir() if d.is_dir()]
    
    if not subfolders:
        print("No subfolders found in abilities directory")
        return
    
    print("=" * 70)
    print("Organizing Ability Icons by Intelligent Sorting")
    print("=" * 70)
    print(f"Target directory: {abilities_dir}")
    print(f"Found {len(subfolders)} subfolders\n")
    
    if dry_run and not add_prefixes:
        print("PREVIEW MODE - Showing recommended file order")
        print("(Files are not being modified)\n")
    elif add_prefixes:
        print("⚠️  WARNING: Adding prefixes will rename files and break code references!")
        print("Make sure you update all code that references these icons!\n")
        response = input("Continue? (yes/no): ")
        if response.lower() != 'yes':
            print("Cancelled.")
            return
    
    total_files = 0
    all_renamed = []
    
    for subfolder in sorted(subfolders):
        file_count = len(list(subfolder.glob("*.png")))
        if file_count == 0:
            continue
        
        print(f"\n{'='*70}")
        print(f"Processing: {subfolder.name} ({file_count} files)")
        print('='*70)
        
        processed, renamed = reorganize_folder(subfolder, dry_run=dry_run, add_prefixes=add_prefixes)
        
        if add_prefixes and renamed:
            all_renamed.extend([(subfolder.name, old, new) for old, new in renamed])
            print(f"  ✓ Renamed {processed} files")
        elif not add_prefixes:
            print(f"  ✓ Analyzed {processed} files")
        
        total_files += processed
    
    print("\n" + "=" * 70)
    print(f"Summary: Processed {total_files} files across {len(subfolders)} folders")
    print("=" * 70)
    
    if dry_run and not add_prefixes:
        print("\nThis was a preview. To see the recommended order, files are already shown above.")
        print("NOTE: Adding numeric prefixes would break existing code references.")
        print("Consider using a file manager that supports custom sorting instead.")
    elif add_prefixes and all_renamed:
        print(f"\n⚠️  IMPORTANT: {len(all_renamed)} files were renamed!")
        print("You must update all code references to use the new prefixed filenames.")

if __name__ == "__main__":
    import sys
    
    # Default to dry-run (preview mode) for safety
    # Use --apply-prefixes to actually rename files (WARNING: breaks references)
    dry_run = "--apply-prefixes" not in sys.argv
    add_prefixes = "--apply-prefixes" in sys.argv
    
    main(dry_run=dry_run, add_prefixes=add_prefixes)

