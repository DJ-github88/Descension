import numpy as np
from PIL import Image
import os
from collections import deque

def slice_blobs():
    image_path = 'D:/VTT/Images/Editor/Tiles/Sand TIles.png'
    out_dir = 'd:/VTT/vtt-react/public/assets/tiles'
    if not os.path.exists(out_dir): os.makedirs(out_dir)
    
    img = Image.open(image_path).convert('RGB')
    arr = np.array(img)
    
    # 1. Mask of "sand" (very high red channel)
    mask = arr[:, :, 0] > 150 
    h, w = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    
    print(f'Starting blob detection on {w}x{h} sheet...')
    tiles = []
    
    # We scan for unvisited sand pixels
    # Since we expect 344x384 areas, we can skip ahead a bit
    for y in range(0, h, 10):
        for x in range(0, w, 10):
            if mask[y, x] and not visited[y, x]:
                # Found a new tile! Flood fill for bbox
                ymin_b, ymax_b = y, y
                xmin_b, xmax_b = x, x
                
                queue = deque([(x, y)])
                visited[y, x] = True
                
                # Fast BFS for blob bounding box
                # We use a 10px step for performance if we assume the tiles are large
                # But for a precise crop, we need pixel accuracy.
                # Let's do a fast expansion.
                while queue:
                    cx, cy = queue.popleft()
                    xmin_b = min(xmin_b, cx); xmax_b = max(xmax_b, cx)
                    ymin_b = min(ymin_b, cy); ymax_b = max(ymax_b, cy)
                    
                    # Check 4 neighbors with a larger jump to cover small dark pixels
                    # If we jump 5 pixels, we cross most borders but stay in tile
                    # No, let's jump 2px.
                    for dx, dy in [(0, 5), (0, -5), (5, 0), (-5, 0)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h:
                            if mask[ny, nx] and not visited[ny, nx]:
                                visited[ny, nx] = True
                                queue.append((nx, ny))
                
                # Check if it is a "real" tile (min size 100x100)
                if (xmax_b - xmin_b) > 100 and (ymax_b - ymin_b) > 100:
                    tiles.append((xmin_b, ymin_b, xmax_b + 1, ymax_b + 1))
                    print(f'Found tile {len(tiles)}: {tiles[-1]}')
                    
                    # Mark the whole discovered area as visited
                    visited[ymin_b:ymax_b+1, xmin_b:xmax_b+1] = True
    
    # 2. Sort tiles by y, then x to name them consistently
    tiles.sort(key=lambda t: (t[1]//100, t[0]))
    
    # 3. Save
    for i, bbox in enumerate(tiles):
        tile = img.crop(bbox)
        tile.save(os.path.join(out_dir, f'Sand{i+1}.png'))
        
    print(f'Final Report: Created {len(tiles)} borderless tiles using blob detection.')

if __name__ == '__main__':
    slice_blobs()
