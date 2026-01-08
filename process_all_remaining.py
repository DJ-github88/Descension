"""
Helper script to process all remaining icons in subfolders
This will help identify how many icons remain in each folder
"""

from pathlib import Path

base_dir = Path(r"D:\DnD2\vtt-react\public\assets\icons\items\Misc\Profession Resources")

folders = ["Blacksmithing", "Enchanting", "Engineering", "Farming", "First Aid", "Gems", "Herbs", "Ore", "Tailoring"]

print("Remaining Icon*.png files in each folder:\n")
for folder in folders:
    folder_path = base_dir / folder
    if folder_path.exists():
        icons = sorted(folder_path.glob("Icon*.png"))
        if icons:
            print(f"{folder}: {len(icons)} icons")
            # Also check for "more" subfolder
            more_path = folder_path / "more"
            if more_path.exists():
                more_icons = sorted(more_path.glob("Icon*.png"))
                if more_icons:
                    print(f"  {folder}/more: {len(more_icons)} icons")

