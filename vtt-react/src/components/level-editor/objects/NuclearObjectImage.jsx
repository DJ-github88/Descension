import React, { useState, useEffect, useRef } from 'react';

const NuclearObjectImage = ({ src, alt, className, style }) => {
    const [processedSrc, setProcessedSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const cacheRef = useRef(new Map());

    useEffect(() => {
        if (!src) return;
        
        // Check local cache
        if (cacheRef.current.has(src)) {
            setProcessedSrc(cacheRef.current.get(src));
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = canvas.width;
            const height = canvas.height;
            
            // 1. Identify Background Seed Colors
            const seeds = [];
            const step = 0.2; 
            for (let t = 0; t <= 1; t += step) {
                seeds.push({x: Math.floor(t * (width-1)), y: 0});
                seeds.push({x: Math.floor(t * (width-1)), y: height-1});
                seeds.push({x: 0, y: Math.floor(t * (height-1))});
                seeds.push({x: width-1, y: Math.floor(t * (height-1))});
            }
            
            const seedColors = seeds.map(p => {
                const i = (p.y * width + p.x) * 4;
                return [data[i], data[i+1], data[i+2]];
            });

            // Calculate Average Seed Color
            let avgR = 0, avgG = 0, avgB = 0;
            seedColors.forEach(c => { avgR += c[0]; avgG += c[1]; avgB += c[2]; });
            avgR /= seedColors.length; avgG /= seedColors.length; avgB /= seedColors.length;

            // Check if background is vibrant
            const isVibrantBg = (avgR > 180 && avgG < 120 && avgB > 180) || // Magenta
                               (avgR < 120 && avgG > 180 && avgB < 120) || // Green
                               (avgR < 120 && avgG < 120 && avgB > 180);   // Blue

            // 2. Flood Fill Transparency (from edges)
            const visited = new Uint8Array(width * height);
            const queue = [...seeds];
            seeds.forEach(p => visited[p.y * width + p.x] = 1);

            while (queue.length > 0) {
                const {x, y} = queue.shift();
                const i = (y * width + x) * 4;
                const r = data[i], g = data[i+1], b = data[i+2];
                
                let isMatch = false;
                for (const s of seedColors) {
                    if (Math.abs(r - s[0]) < 50 && Math.abs(g - s[1]) < 50 && Math.abs(b - s[2]) < 50) {
                        isMatch = true; break;
                    }
                }
                
                // Catch checkerboard colors
                if (!isMatch && !isVibrantBg && r > 160 && g > 160 && b > 160) {
                    const diff = Math.abs(r-g) + Math.abs(g-b) + Math.abs(r-b);
                    if (diff < 40) isMatch = true; 
                }

                if (isMatch) {
                    data[i + 3] = 0; 
                    const neighbors = [{nx: x+1, ny: y}, {nx: x-1, ny: y}, {nx: x, ny: y+1}, {nx: x, ny: y-1}];
                    for (const {nx, ny} of neighbors) {
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny * width + nx]) {
                            visited[ny * width + nx] = 1;
                            queue.push({x: nx, y: ny});
                        }
                    }
                }
            }

            // 3. Global Pocket Scan
            for (let i = 0; i < data.length; i += 4) {
                if (data[i+3] === 0) continue;
                const r = data[i], g = data[i+1], b = data[i+2];
                
                const distToBg = Math.abs(r - avgR) + Math.abs(g - avgG) + Math.abs(b - avgB);
                const diff = Math.abs(r-g) + Math.abs(g-b) + Math.abs(r-b);

                // Priority 1: If it matches a seed color (background), CLEAR IT regardless of saturation
                let isMatch = false;
                for (const s of seedColors) {
                    // Increased tolerance (from 35 to 45) to catch remnants like magenta ropes
                    if (Math.abs(r - s[0]) < 45 && Math.abs(g - s[1]) < 45 && Math.abs(b - s[2]) < 45) {
                        isMatch = true; break;
                    }
                }
                if (isMatch) {
                    data[i + 3] = 0;
                    continue;
                }

                // Priority 2: If it's very saturated (vibrant colors), PROTECT IT
                const isVerySaturated = diff > 60; // Lowered from 75 to protect more detail
                if (isVerySaturated) continue;

                if (isVibrantBg) {
                    if (distToBg < 70) data[i + 3] = 0; // Increased for better vibrant cleanup
                } else if ((distToBg < 55 && diff < 40) || (r > 195 && g > 195 && b > 195 && diff < 20)) {
                    // Lowered distToBg from 110 to 55 to protect object details like gray stones/ash
                    data[i + 3] = 0;
                }
            }
            
            // 4. Post-Process: Clean edges but preserve vibrant highlights
            for (let i = 0; i < data.length; i += 4) {
                if (data[i+3] === 0) continue;
                const r = data[i], g = data[i+1], b = data[i+2];
                
                if (r > 215 && g > 215 && b > 215) {
                    const diff = Math.abs(r-g) + Math.abs(g-b);
                    if (diff < 15) {
                        const x = (i/4) % width;
                        const y = Math.floor((i/4) / width);
                        let hasTransNeighbor = false;
                        if (x > 0 && data[i - 4 + 3] === 0) hasTransNeighbor = true;
                        else if (x < width - 1 && data[i + 4 + 3] === 0) hasTransNeighbor = true;
                        else if (y > 0 && data[i - width * 4 + 3] === 0) hasTransNeighbor = true;
                        else if (y < height - 1 && data[i + width * 4 + 3] === 0) hasTransNeighbor = true;
                        
                        if (hasTransNeighbor) {
                            data[i + 3] = Math.max(0, data[i + 3] - 120);
                        }
                    }
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            const dataUrl = canvas.toDataURL();
            cacheRef.current.set(src, dataUrl);
            setProcessedSrc(dataUrl);
            setIsLoading(false);
        };

        img.onerror = () => {
            setProcessedSrc(src); // Fallback to original
            setIsLoading(false);
        };
    }, [src]);

    if (isLoading && !processedSrc) {
        return <div className={`${className} loading-placeholder`} style={{ ...style, background: 'rgba(0,0,0,0.05)' }} />;
    }

    return (
        <img 
            src={processedSrc || src} 
            alt={alt} 
            className={className} 
            style={{ 
                ...style, 
                visibility: processedSrc ? 'visible' : 'hidden',
                imageRendering: 'pixelated'
            }} 
        />
    );
};

export default NuclearObjectImage;
