import numpy as np
from PIL import Image

def find():
    img = Image.open('D:/VTT/Images/Editor/Tiles/Sand TIles.png').convert('RGB')
    arr = np.array(img)
    mask = np.max(arr, axis=2) > 30 # Threshold for non-black
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    
    y_coords = np.where(rows)[0]
    x_coords = np.where(cols)[0]
    
    if len(y_coords) == 0 or len(x_coords) == 0:
        print('No sand found!')
    else:
        print(f'xmin={x_coords[0]}, ymin={y_coords[0]}, xmax={x_coords[-1]}, ymax={y_coords[-1]}')
        
if __name__ == '__main__':
    find()
