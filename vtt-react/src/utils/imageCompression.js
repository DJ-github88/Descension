/**
 * Compress an image file to reduce size and improve performance
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {number} maxHeight - Maximum height in pixels (default: null, maintains aspect ratio)
 * @param {number} quality - JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<Blob>} - Compressed image as Blob
 */
export const compressImage = (file, maxWidth = 800, maxHeight = null, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions while maintaining aspect ratio
            let newWidth = img.width;
            let newHeight = img.height;

            if (maxWidth && img.width > maxWidth) {
                const ratio = maxWidth / img.width;
                newWidth = maxWidth;
                newHeight = img.height * ratio;
            }

            if (maxHeight && newHeight > maxHeight) {
                const ratio = maxHeight / newHeight;
                newWidth = newWidth * ratio;
                newHeight = maxHeight;
            }

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Draw and compress
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                },
                'image/jpeg',
                quality
            );
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        img.src = URL.createObjectURL(file);
    });
};

