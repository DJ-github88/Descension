import { useEffect, useState, useCallback } from "react";
import '../styles/Grid.css';

export default function Grid() {
    const tileSize = 50; // Set grid tile size
    const [grid, setGrid] = useState([]);

    const createGrid = useCallback(() => {
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        const cols = Math.ceil(containerWidth / tileSize);
        const rows = Math.ceil(containerHeight / tileSize);

        let newGrid = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                newGrid.push({ x: j * tileSize, y: i * tileSize });
            }
        }
        setGrid(newGrid);
    }, [tileSize]);

    useEffect(() => {
        createGrid();
        
        // Debounce resize event
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                createGrid();
            }, 100); // Wait 100ms after last resize event
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimer);
        };
    }, [createGrid]);

    return (
        <div 
            id="grid-overlay" 
            style={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "100%", 
                pointerEvents: "none",
                overflow: "hidden",
                zIndex: 0
            }}
        >
            {grid.map((tile) => (
                <div 
                    key={`${tile.x}-${tile.y}`}
                    className="grid-tile"
                    style={{
                        position: "absolute",
                        width: `${tileSize}px`,
                        height: `${tileSize}px`,
                        left: `${tile.x}px`,
                        top: `${tile.y}px`,
                        border: "1px solid rgba(64, 196, 255, 0.2)", // Increased opacity from 0.05 to 0.2
                        boxSizing: "border-box"
                    }}
                />
            ))}
        </div>
    );
}