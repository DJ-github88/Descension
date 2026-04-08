from PIL import Image
import numpy as np
import sys

def analyze():
    image_path = 'D:/VTT/Images/Editor/Tiles/Sand TIles.png'
    print(f'Analyzing {image_path}...')
    img = Image.open(image_path).convert('L')
    arr = np.array(img)
    print(f'Shape: {arr.shape}')
    
    def find_lines(means, threshold=15):
        lines = []
        start = -1
        for i, val in enumerate(means):
            if val < threshold:
                if start == -1: start = i
            else:
                if start != -1:
                    lines.append((start, i - 1))
                    start = -1
        if start != -1:
            lines.append((start, len(means) - 1))
        return lines

    # Horizontal lines - axis 1 means we average each row
    h_lines = find_lines(np.mean(arr, axis=1))
    # Vertical lines - axis 0 means we average each column
    v_lines = find_lines(np.mean(arr, axis=0))
    
    print('Horizontal dark lines:', h_lines)
    print('Vertical dark lines:', v_lines)
    
    # Calculate crop areas (the gaps between dark lines)
    def to_crops(lines, size):
        crops = []
        last = 0
        for start, end in lines:
            if start > last:
                crops.append((last, start))
            last = end + 1
        if last < size:
            crops.append((last, size))
        return crops

    h_crops = to_crops(h_lines, arr.shape[0])
    v_crops = to_crops(v_lines, arr.shape[1])
    
    print('Horizontal content bands (y):', h_crops)
    print('Vertical content bands (x):', v_crops)

if __name__ == '__main__':
    analyze()
