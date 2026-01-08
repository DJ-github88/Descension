"""
Profession Resource Icon Processing - Works with AI Agent to analyze and organize icons
The AI agent will analyze images and this script will apply the results.
"""

import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Set, Optional


class ProfessionResourceProcessor:
    def __init__(self, base_dir: str):
        self.base_dir = Path(base_dir)
        self.mapping_file = self.base_dir / "profession-resource-mapping.json"
        self.mapping = self.load_mapping()
        self.processed = self._get_processed_set()
    
    def load_mapping(self) -> Dict:
        if self.mapping_file.exists():
            with open(self.mapping_file, 'r') as f:
                return json.load(f)
        return {
            "resources": [],
            "metadata": {
                "created": datetime.now().isoformat(),
                "base_directory": str(self.base_dir)
            }
        }
    
    def _get_processed_set(self) -> Set[str]:
        """Get set of already processed file paths (relative to base_dir)."""
        processed = set()
        for entry in self.mapping.get("resources", []):
            original = entry.get("original_path", "")
            if original:
                processed.add(original)
        return processed
    
    def save_mapping(self):
        self.mapping["metadata"]["last_updated"] = datetime.now().isoformat()
        self.mapping["metadata"]["total_icons"] = len(self.mapping["resources"])
        with open(self.mapping_file, 'w') as f:
            json.dump(self.mapping, f, indent=2)
    
    def get_unprocessed_icons(self, subfolder: Optional[str] = None, limit: int = None) -> List[Dict]:
        """
        Get unprocessed Icon*.png files.
        Returns list of dicts with 'path' (Path object) and 'relative_path' (str).
        """
        icons = []
        
        if subfolder:
            search_dir = self.base_dir / subfolder
        else:
            search_dir = self.base_dir
        
        if not search_dir.exists():
            return icons
        
        # Find all Icon*.png files (case insensitive)
        for icon_path in sorted(search_dir.glob("Icon*.png")):
            # Get relative path from base_dir
            try:
                relative_path = icon_path.relative_to(self.base_dir)
                relative_str = str(relative_path).replace('\\', '/')
                
                if relative_str not in self.processed:
                    icons.append({
                        "path": icon_path,
                        "relative_path": relative_str,
                        "folder": subfolder or ""
                    })
            except ValueError:
                # File not relative to base_dir, skip
                continue
        
        if limit:
            return icons[:limit]
        return icons
    
    def get_all_unprocessed_icons(self, limit: int = None) -> List[Dict]:
        """Get all unprocessed icons from main dir, More folder, and subfolders."""
        all_icons = []
        
        # Main directory
        all_icons.extend(self.get_unprocessed_icons(subfolder=None))
        
        # "More (remove this once sorted)" folder
        more_folder = self.base_dir / "More (remove this once sorted)"
        if more_folder.exists():
            all_icons.extend(self.get_unprocessed_icons(subfolder="More (remove this once sorted)"))
        
        # Existing subfolders
        for subfolder in ["Blacksmithing", "Enchanting", "Engineering", "Farming", 
                         "First Aid", "Gems", "Herbs", "Ore", "Tailoring", "Mining", "Archaeology", "Woodworking"]:
            subfolder_path = self.base_dir / subfolder
            if subfolder_path.exists():
                all_icons.extend(self.get_unprocessed_icons(subfolder=subfolder))
                
                # Check for "more" subfolder
                more_sub = subfolder_path / "more"
                if more_sub.exists():
                    all_icons.extend(self.get_unprocessed_icons(
                        subfolder=f"{subfolder}/more"
                    ))
                
                # Check for "Sigil" subfolder (in Enchanting)
                if subfolder == "Enchanting":
                    sigil_sub = subfolder_path / "Sigil"
                    if sigil_sub.exists():
                        all_icons.extend(self.get_unprocessed_icons(
                            subfolder=f"{subfolder}/Sigil"
                        ))
        
        if limit:
            return all_icons[:limit]
        return all_icons
    
    def generate_filename(self, name: str, category: str, existing: Set[str]) -> str:
        """Generate unique filename following resource-* pattern."""
        clean_name = name.lower().replace(' ', '-').replace('_', '-')
        clean_name = ''.join(c if c.isalnum() or c == '-' else '' for c in clean_name)
        while '--' in clean_name:
            clean_name = clean_name.replace('--', '-')
        clean_name = clean_name.strip('-')
        
        # Use resource- prefix
        if not clean_name.startswith("resource-"):
            filename = f"resource-{clean_name}.png"
        else:
            filename = f"{clean_name}.png"
        
        counter = 1
        base_name = filename.replace('.png', '')
        while filename in existing:
            filename = f"{base_name}_{counter}.png"
            counter += 1
        return filename
    
    def apply_analysis(self, analyses: List[Dict]):
        """Apply AI analysis results to organize icons."""
        existing_filenames = set(entry["filename"] for entry in self.mapping.get("resources", []))
        
        for analysis in analyses:
            original_path = analysis["original_path"]
            icon_path = self.base_dir / original_path
            
            if not icon_path.exists():
                print(f"⚠️  File not found: {original_path}")
                continue
            
            name = analysis.get("name", "unknown")
            category = analysis.get("category", "Misc")
            description = analysis.get("description", "")
            
            # Generate unique filename
            filename = self.generate_filename(name, category, existing_filenames)
            existing_filenames.add(filename)
            
            # Determine target category folder
            # Use existing folder if category matches, otherwise create new or use Misc
            category_dir = self.base_dir / category
            category_dir.mkdir(exist_ok=True)
            
            new_path = category_dir / filename
            
            # Move file
            try:
                shutil.move(str(icon_path), str(new_path))
            except Exception as e:
                print(f"⚠️  Error moving {original_path}: {e}")
                continue
            
            # Add to mapping
            entry = {
                "original_path": original_path,
                "filename": filename,
                "category": category,
                "name": name,
                "description": description,
                "new_path": f"{category}/{filename}",
                "processed_at": datetime.now().isoformat()
            }
            self.mapping["resources"].append(entry)
            self.processed.add(original_path)
            
            print(f"✓ {original_path} → {category}/{filename}")
        
        self.save_mapping()
        print(f"\n✓ Saved mapping to {self.mapping_file}")
    
    def cleanup_more_folders(self):
        """Remove 'More' folders that should be empty after processing."""
        more_folders = [
            self.base_dir / "More (remove this once sorted)",
        ]
        
        # Check subfolders for "more" directories
        for subfolder in ["Blacksmithing", "Enchanting", "Engineering", "Farming", 
                         "First Aid", "Gems", "Herbs", "Ore", "Tailoring", "Mining", "Archaeology", "Woodworking"]:
            subfolder_path = self.base_dir / subfolder
            if subfolder_path.exists():
                more_sub = subfolder_path / "more"
                if more_sub.exists():
                    more_folders.append(more_sub)
        
        for more_folder in more_folders:
            if more_folder.exists():
                # Check if folder is empty or only has Icon*.png files
                remaining = list(more_folder.glob("Icon*.png"))
                if len(remaining) == 0:
                    try:
                        more_folder.rmdir()
                        print(f"✓ Removed empty folder: {more_folder.relative_to(self.base_dir)}")
                    except Exception as e:
                        print(f"⚠️  Could not remove {more_folder}: {e}")
                else:
                    print(f"⚠️  Folder still has {len(remaining)} unprocessed icons: {more_folder.relative_to(self.base_dir)}")


if __name__ == "__main__":
    import sys
    
    base_directory = r"D:\DnD2\vtt-react\public\assets\icons\items\Misc\Profession Resources"
    processor = ProfessionResourceProcessor(base_directory)
    
    # If analysis file provided, apply it
    if len(sys.argv) > 1:
        analysis_file = sys.argv[1]
        print(f"Loading analysis from: {analysis_file}")
        with open(analysis_file, 'r') as f:
            analyses = json.load(f)
        print(f"Applying {len(analyses)} analyses...\n")
        processor.apply_analysis(analyses)
    else:
        # Get next batch to process
        batch = processor.get_all_unprocessed_icons(limit=20)
        print(f"Found {len(batch)} icons to process")
        print("\nIcons in this batch:")
        for i, icon_info in enumerate(batch, 1):
            print(f"  {i}. {icon_info['relative_path']} (folder: {icon_info['folder']})")

