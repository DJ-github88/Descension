import numpy as np
from PIL import Image

def find():
    img = Image.open('D:/VTT/Images/Editor/Tiles/Sand TIles.png').convert('L')
    arr = np.array(img)
    
    def get_lines(data, axis):
        mask = np.mean(data < 40, axis=axis) > 0.5
        indices = np.where(mask)[0]
        if len(indices) == 0: return []
        
        # Group contiguous indices
        groups = []
        if len(indices) > 0:
            start = indices[0]
            for i in range(1, len(indices)):
                if indices[i] > indices[i-1] + 1:
                    groups.append((start, indices[i-1]))
                    start = indices[i]
            groups.append((start, indices[-1]))
        return groups

    h_lines = get_lines(arr, 1)
    v_lines = get_lines(arr, 0)
    
    print('Horizontal dark bands (Row y-ranges):', h_lines)
    print('Vertical dark bands (Col x-ranges):', v_lines)

if __name__ == '__main__':
    find()
