import numpy as np
from PIL import Image
import os
from collections import deque

def slice_cv():
    image_path = 'D:/VTT/Images/Editor/Tiles/Sand TIles.png'
    out_dir = 'd:/VTT/vtt-react/public/assets/tiles'
    if not os.path.exists(out_dir): os.makedirs(out_dir)
    
    img = Image.open(image_path).convert('RGB')
    arr = np.array(img)
    
    # 1. Stricter mask: Grid lines are very black (under 30)
    # Sand starts above 100.
    mask = np.max(arr, axis=2) > 50 
    h, w = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    
    print(f'Starting pixel-level blob detection...')
    tiles = []
    
    for y in range(h):
        for x in range(w):
            if mask[y, x] and not visited[y, x]:
                # Found sand!
                ymin_b, ymax_b = y, y
                xmin_b, xmax_b = x, x
                
                # Flood fill strictly 1-pixel steps to find disconnected areas
                # if there is even ONE pixel gap, it will be a separate blob.
                queue = deque([(x, y)])
                visited[y, x] = True
                
                while queue:
                    cx, cy = queue.popleft()
                    xmin_b = min(xmin_b, cx); xmax_b = max(xmax_b, cx)
                    ymin_b = min(ymin_b, cy); ymax_b = max(ymax_b, cy)
                    
                    # 4-connectivity, 1-pixel step
                    for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h:
                            if mask[ny, nx] and not visited[ny, nx]:
                                visited[ny, nx] = True
                                queue.append((nx, ny))
                
                # Only keep significant blobs (approx tile size)
                # If they are smaller than 50x50, they are probably artifacts
                if (xmax_b - xmin_b) > 100 and (ymax_b - ymin_b) > 100:
                    tiles.append((xmin_b, ymin_b, xmax_b + 1, ymax_b + 1))
                    print(f'Found tile {len(tiles)}: {tiles[-1]}')
    
    # Sort and save
    tiles.sort(key=lambda t: (t[1]//200, t[0])) # Group by rows
    
    for i, bbox in enumerate(tiles):
        tile = img.crop(bbox)
        tile.save(os.path.join(out_dir, f'Sand{i+1}.png'))
        
    print(f'Final Report: Successfully identified {len(tiles)} unique sand tiles.')

if __name__ == '__main__':
    slice_cv()
