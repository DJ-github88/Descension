from PIL import Image
import os

def slice():
    image_path = 'D:/VTT/Images/Editor/Tiles/Sand TIles.png'
    out_dir = 'd:/VTT/vtt-react/public/assets/tiles'
    
    img = Image.open(image_path).convert('RGB')
    w, h = img.size
    px = img.load()
    
    # 1. Find the REAL top-left of the sand in slot (0,0)
    # We look for the first pixel with high red value (>160 is typical for sand)
    real_x0, real_y0 = -1, -1
    for y in range(200):
        for x in range(200):
            if px[x, y][0] > 160:
                real_x0, real_y0 = x, y
                break
        if real_x0 != -1: break
        
    print(f'Detected sand start: ({real_x0}, {real_y0})')
    
    # 2. Find the REAL end of the first sand tile
    real_x1, real_y1 = -1, -1
    # Check along row real_y0+50
    for x in range(real_x0 + 100, 600):
        if px[x, real_y0+50][0] < 100: # Found a grid line
            real_x1 = x
            break
    # Check along col real_x0+50
    for y in range(real_y0 + 100, 600):
        if px[real_x0+50, y][0] < 100: # Found a grid line
            real_y1 = y
            break
            
    print(f'Detected tile bounds for slot 0,0: ({real_x0}, {real_y0}) to ({real_x1}, {real_y1})')
    
    if real_x1 == -1 or real_y1 == -1: 
        print('Grid detection failed!')
        return

    # 3. Calculate full grid geometry
    # Tile size
    sand_w = real_x1 - real_x0
    sand_h = real_y1 - real_y0
    print(f'Sand Tile size: {sand_w}x{sand_h}')
    
    # Grid spacing (total width of tile + divider)
    # We find where the NEXT tile starts
    next_x0 = -1
    for x in range(real_x1 + 1, real_x1 + 100):
        if px[x, real_y0+50][0] > 160:
            next_x0 = x
            break
            
    spacing_x = next_x0 - real_x0
    print(f'X Spacing (Period): {spacing_x}')

    # Repeat for Y
    next_y0 = -1
    for y in range(real_y1 + 1, real_y1 + 100):
        if px[real_x0+50, y][0] > 160:
            next_y0 = y
            break
    spacing_y = next_y0 - real_y0
    print(f'Y Spacing (Period): {spacing_y}')
    
    # 4. Final Slicing with these precise metrics
    # Note: If no next is found, we assume a dense grid (spacing = size)
    # But from the screenshot, there was a gap.
    
    count = 0
    # Determine grid count based on sheet size
    cols = (w - real_x0) // spacing_x
    rows = (h - real_y0) // spacing_y
    print(f'Identified Grid: {cols}x{rows}')
    
    for r in range(rows):
        for c in range(cols):
            count += 1
            l = real_x0 + c * spacing_x
            t = real_y0 + r * spacing_y
            r_c = l + sand_w
            b_c = t + sand_h
            
            tile = img.crop((l, t, r_c, b_c))
            tile.save(os.path.join(out_dir, f'Sand{count}.png'))
            
    print(f'Done! Successfully generated {count} perfectly aligned sand tiles.')

if __name__ == '__main__':
    slice()
