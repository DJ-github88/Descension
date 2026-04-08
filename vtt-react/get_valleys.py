import numpy as np
from PIL import Image

def find():
    img = Image.open('D:/VTT/Images/Editor/Tiles/Sand TIles.png').convert('L')
    arr = np.array(img)
    v_means = np.mean(arr, axis=0) # Average each column
    h_means = np.mean(arr, axis=1) # Average each row
    
    def find_best_valleys(means, name, threshold=120):
        print(f'\n{name} valleys:')
        best_valleys = []
        for i in range(1, len(means)-1):
            if means[i] < threshold and means[i] < means[i-1] and means[i] < means[i+1]:
                best_valleys.append((i, means[i]))
        
        # Sort by brightness (darkest first)
        best_valleys.sort(key=lambda x: x[1])
        for i, val in best_valleys[:30]: # Show top 30 darkest lines
            print(f'{name} {i}: {val:.1f}')
            
    find_best_valleys(v_means, 'Col')
    find_best_valleys(h_means, 'Row')

if __name__ == '__main__':
    find()
