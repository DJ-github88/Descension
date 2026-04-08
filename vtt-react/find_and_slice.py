import numpy as np
from PIL import Image
import os

def find_and_slice():
    image_path = 'D:/VTT/Images/Editor/Tiles/Sand TIles.png'
    out_dir = 'd:/VTT/vtt-react/public/assets/tiles'
    if not os.path.exists(out_dir): os.makedirs(out_dir)
    
    img = Image.open(image_path).convert('RGB')
    arr = np.array(img)
    mask = np.max(arr, axis=2) > 30 # Mask of sand content
    
    # 1. Detect the overall bounding box of all content
    y_any = np.any(mask, axis=1)
    x_any = np.any(mask, axis=0) if np.any(y_any) else []
    
    if not np.any(y_any):
        print('No sand found!')
        return
        
    ymin, ymax = np.where(y_any)[0][[0, -1]]
    xmin, xmax = np.where(x_any)[0][[0, -1]]
    print(f'Sheet content area: ({xmin}, {ymin}) to ({xmax}, {ymax})')
    
    # Content dimensions:
    # We suspect a grid of 8x4 within this area.
    # Let's find the FIRST gap (internal border) to find the tile size.
    # We look for rows/cols that are MOSTLY black INSIDE the content area.
    
    def find_internal_dividers(data, start, end, axis):
        dividers = []
        # Average brightness across opposite axis within slice
        for i in range(start + 50, end - 50): # Skip outer edges
            if axis == 0: # Horizontal line scan
                line = data[i, xmin+50:xmax-50]
            else: # Vertical line scan
                line = data[ymin+50:ymax-50, i]
                
            if np.mean(np.max(line, axis=-1) < 40) > 0.8: # 80%+ dark
                dividers.append(i)
        
        # Group contiguous divider lines
        bands = []
        if dividers:
            s = dividers[0]
            for i in range(1, len(dividers)):
                if dividers[i] > dividers[i-1] + 5: # Min 5px gap between different borders
                    bands.append((s, dividers[i-1]))
                    s = dividers[i]
            bands.append((s, dividers[-1]))
        return bands

    row_divs = find_internal_dividers(arr, ymin, ymax, 0)
    col_divs = find_internal_dividers(arr, xmin, xmax, 1)
    
    print(f'Internal H-dividers: {row_divs}')
    print(f'Internal V-dividers: {col_divs}')
    
    # Grid boundaries:
    y_boundaries = [ymin] + [ (b[0] + b[1])//2 for b in row_divs ] + [ymax + 1]
    x_boundaries = [xmin] + [ (b[0] + b[1])//2 for b in col_divs ] + [xmax + 1]
    
    print(f'Y segments: {y_boundaries}')
    print(f'X segments: {x_boundaries}')
    
    count = 0
    for r in range(len(y_boundaries) - 1):
        for c in range(len(x_boundaries) - 1):
            count += 1
            l, t = x_boundaries[c], y_boundaries[r]
            r_c, b_c = x_boundaries[c+1], y_boundaries[r+1]
            
            # Sub-crop to the segment
            tile = img.crop((l, t, r_c, b_c))
            
            # Shift the crop points to skip the exact divider pixels
            # We skip the borders by taking from bbox of content within segment
            def final_autocrop(im):
                a = np.array(im)
                m = np.max(a, axis=2) > 30
                rows_m = np.any(m, axis=1)
                cols_m = np.any(m, axis=0)
                if not np.any(rows_m): return None
                ymin_m, ymax_m = np.where(rows_m)[0][[0, -1]]
                xmin_m, xmax_m = np.where(cols_m)[0][[0, -1]]
                return im.crop((xmin_m, ymin_m, xmax_m + 1, ymax_m + 1))
            
            tile = final_autocrop(tile)
            if tile:
                tile.save(os.path.join(out_dir, f'Sand{count}.png'))
                
    print(f'Done! Created {count} perfectly borderless tiles.')

if __name__ == '__main__':
    find_and_slice()
