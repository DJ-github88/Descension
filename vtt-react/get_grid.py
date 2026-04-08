import numpy as np
from PIL import Image

def find():
    img = Image.open('D:/VTT/Images/Editor/Tiles/Sand TIles.png').convert('L')
    arr = np.array(img)
    h, w = arr.shape
    
    print(f'Sheet: {w}x{h}')
    
    # 1. Sample the first few rows to find the pattern
    print('First 344 columns average brightness:')
    h_profile = np.mean(arr[:384, :], axis=0)
    for i in range(20):
         print(f'Col {i}: {h_profile[i]:.1f}')
    
    # 2. Find rows/cols where at least 50% are very dark
    def find_lines(means_data, threshold=50, dark_val=40):
         lines = []
         for i in range(means_data.shape[0]):
             if np.mean(means_data[i, :] < dark_val) > 0.5: # 50% are dark
                 lines.append(i)
         return lines

    h_lines = find_lines(arr)
    v_lines = find_lines(arr.T)
    
    print('Horizontal dark lines (y):', h_lines)
    print('Vertical dark lines (x):', v_lines)
    
if __name__ == '__main__':
    find()
