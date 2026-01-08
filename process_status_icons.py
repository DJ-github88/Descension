"""
Status Icon Processing - Works with AI Agent to analyze and organize status icons
The AI agent will analyze images and this script will apply the results.

Status Categories (based on ConditionsWindow.jsx and statusEffects.js):
- movement: Movement control effects (stun, slow, root, knockback, pull, haste, restrained)
- mental: Mental control effects (fear, charm, confuse, sleep, charmed, frightened)
- physical: Physical conditions (poisoned, diseased, exhausted, paralyzed, poisoned)
- magical: Magical effects (silenced, dispelled, curse)
- combat: Combat conditions (bleeding, burning, blessed, defending, marked, taunt)
- buff: Positive stat/ability boosts (haste, strengthened, resistance, immune, regen, shielded)
- debuff: Negative stat/ability reductions (weakness, vulnerability, curse, disoriented)
- dot: Damage over time (bleed, poison, burning, disease, decay)
- hot: Healing over time (rejuvenation, mend, restoration, regeneration)
- control: Crowd control effects (stun, root, silence, disarm, blind, taunt)
- utility: Utility effects (detection, waterbreathing, waterwalking, featherfall)
- healing: Healing/regeneration effects
- other: Uncategorized status effects
"""

import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Set


class StatusIconProcessor:
    def __init__(self, status_dir: str):
        self.status_dir = Path(status_dir)
        self.mapping_file = self.status_dir.parent / "status-icon-mapping.json"
        self.mapping = self.load_mapping()
        self.processed = set(entry["original"] for entry in self.mapping.get("statuses", []))
    
    def load_mapping(self) -> Dict:
        if self.mapping_file.exists():
            with open(self.mapping_file, 'r') as f:
                return json.load(f)
        return {"statuses": [], "metadata": {"created": datetime.now().isoformat()}}
    
    def save_mapping(self):
        self.mapping["metadata"]["last_updated"] = datetime.now().isoformat()
        self.mapping["metadata"]["total_icons"] = len(self.mapping["statuses"])
        with open(self.mapping_file, 'w') as f:
            json.dump(self.mapping, f, indent=2)
    
    def get_unprocessed_icons(self, limit: int = None) -> List[Path]:
        all_icons = sorted([f for f in self.status_dir.glob("*.png") 
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
        
        filename = f"{clean_name}.png"
        
        counter = 1
        while filename in existing:
            filename = f"{clean_name}_{counter}.png"
            counter += 1
        return filename
    
    def apply_analysis(self, analyses: List[Dict]):
        """Apply AI analysis results to organize icons."""
        existing_filenames = set(entry["filename"] for entry in self.mapping.get("statuses", []))
        
        for analysis in analyses:
            original = analysis["original"]
            icon_path = self.status_dir / original
            
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
            category_dir = self.status_dir / category
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
            self.mapping["statuses"].append(entry)
            self.processed.add(original)
            
            print(f"✓ {original} → {category}/{filename}")
        
        self.save_mapping()
        print(f"\n✓ Saved mapping to {self.mapping_file}")


if __name__ == "__main__":
    import sys
    
    processor = StatusIconProcessor(r"D:\DnD2\vtt-react\public\assets\icons\Status")
    
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

