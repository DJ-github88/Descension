from PIL import Image
import os
import numpy as np

def final_slice():
    image_path = 'D:/VTT/Images/Editor/Tiles/Sand TIles.png'
    out_dir = 'd:/VTT/vtt-react/public/assets/tiles'
    if not os.path.exists(out_dir): os.makedirs(out_dir)
    
    img = Image.open(image_path).convert('RGB')
    arr = np.array(img)
    
    # 1. Precise Detection with Threshold=60 (to ignore the dark margins)
    mask = np.max(arr, axis=2) > 60
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    
    if not np.any(rows) or not np.any(cols):
        print("Error: No sand found with threshold.")
        return
        
    ymin, ymax = np.where(rows)[0][[0, -1]]
    xmin, xmax = np.where(cols)[0][[0, -1]]
    
    # Refine the bounds (as seen in CV result: 91, 86, 2688, 1472)
    print(f'Detected content area: x:{xmin}-{xmax+1}, y:{ymin}-{ymax+1}')
    
    content_w = (xmax + 1) - xmin
    content_h = (ymax + 1) - ymin
    
    grid_x = 8
    grid_y = 4
    
    tile_w_f = content_w / grid_x
    tile_h_f = content_h / grid_y
    
    print(f'Grid calculated: {tile_w_f:.1f}x{tile_h_f:.1f} per tile.')
    
    count = 0
    for r in range(grid_y):
        for c in range(grid_x):
            count += 1
            left = xmin + int(c * tile_w_f)
            top = ymin + int(r * tile_h_f)
            right = xmin + int((c + 1) * tile_w_f)
            bottom = ymin + int((r + 1) * tile_h_f)
            
            # Crop the segment
            tile = img.crop((left, top, right, bottom))
            
            # Strict final autocrop on each 
            def final_clean(im):
                data = np.array(im)
                m = np.max(data, axis=2) > 60
                rm = np.any(m, axis=1); cm = np.any(m, axis=0)
                if not np.any(rm): return im
                tm_y, bm_y = np.where(rm)[0][[0, -1]]
                lm_x, rm_x = np.where(cm)[0][[0, -1]]
                return im.crop((lm_x, tm_y, rm_x + 1, bm_y + 1))
            
            tile = final_clean(tile)
            tile.save(os.path.join(out_dir, f'Sand{count}.png'))
            
    print(f'Slicing complete. Created {count} borderless tiles from the detected area.')

if __name__ == '__main__':
    final_slice()
