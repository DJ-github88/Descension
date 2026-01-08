"""
Direct Icon Processing - Works with AI Agent to analyze and organize icons
The AI agent will analyze images and this script will apply the results.
"""

import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Set


class IconProcessor:
    def __init__(self, icons_dir: str):
        self.icons_dir = Path(icons_dir)
        self.mapping_file = self.icons_dir.parent / "ability-icon-mapping.json"
        self.mapping = self.load_mapping()
        self.processed = set(entry["original"] for entry in self.mapping.get("abilities", []))
    
    def load_mapping(self) -> Dict:
        if self.mapping_file.exists():
            with open(self.mapping_file, 'r') as f:
                return json.load(f)
        return {"abilities": [], "metadata": {"created": datetime.now().isoformat()}}
    
    def save_mapping(self):
        self.mapping["metadata"]["last_updated"] = datetime.now().isoformat()
        self.mapping["metadata"]["total_icons"] = len(self.mapping["abilities"])
        with open(self.mapping_file, 'w') as f:
            json.dump(self.mapping, f, indent=2)
    
    def get_unprocessed_icons(self, limit: int = None) -> List[Path]:
        all_icons = sorted([f for f in self.icons_dir.glob("*.png") 
                           if f.name not in self.processed])
        if limit:
            return all_icons[:limit]
        return all_icons
    
    def generate_filename(self, name: str, category: str, existing: Set[str]) -> str:
        """Generate unique filename."""
        clean_name = name.lower().replace(' ', '-').replace('_', '-')
        clean_name = ''.join(c if c.isalnum() or c == '-' else '' for c in clean_name)
        while '--' in clean_name:
            clean_name = clean_name.replace('--', '-')
        clean_name = clean_name.strip('-')
        
        # Don't duplicate category prefix if name already starts with it
        if clean_name.startswith(f"{category}-"):
            filename = f"{clean_name}.png"
        else:
            filename = f"{clean_name}.png"
        
        counter = 1
        while filename in existing:
            base_name = clean_name if not clean_name.startswith(f"{category}-") else clean_name[len(f"{category}-"):]
            filename = f"{base_name}_{counter}.png"
            counter += 1
        return filename
    
    def apply_analysis(self, analyses: List[Dict]):
        """Apply AI analysis results to organize icons."""
        existing_filenames = set(entry["filename"] for entry in self.mapping.get("abilities", []))
        
        for analysis in analyses:
            original = analysis["original"]
            icon_path = self.icons_dir / original
            
            if not icon_path.exists():
                print(f"⚠️  File not found: {original}")
                continue
            
            name = analysis.get("name", "unknown")
            category = analysis.get("category", "other")
            description = analysis.get("description", "")
            
            # Generate unique filename
            filename = self.generate_filename(name, category, existing_filenames)
            existing_filenames.add(filename)
            
            # Create category directory
            category_dir = self.icons_dir / category
            category_dir.mkdir(exist_ok=True)
            
            new_path = category_dir / filename
            
            # Move file
            shutil.move(str(icon_path), str(new_path))
            
            # Add to mapping
            entry = {
                "original": original,
                "filename": filename,
                "category": category,
                "name": name,
                "description": description,
                "path": f"{category}/{filename}"
            }
            self.mapping["abilities"].append(entry)
            self.processed.add(original)
            
            print(f"✓ {original} → {category}/{filename}")
        
        self.save_mapping()
        print(f"\n✓ Saved mapping to {self.mapping_file}")


if __name__ == "__main__":
    import sys
    
    processor = IconProcessor(r"D:\DnD2\vtt-react\public\assets\icons\abilities")
    
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
        batch = processor.get_unprocessed_icons(limit=20)
        print(f"Found {len(batch)} icons to process")
        print("\nIcons in this batch:")
        for i, icon in enumerate(batch, 1):
            print(f"  {i}. {icon.name}")

