import { useEffect, useCallback } from "react";
import useGameStore from "../store/gameStore";

export default function Token({ creature }) {
    const tileSize = 50; // Matches grid size
    const token = useGameStore(state => state.tokens.find(t => t.creatureId === creature.id));
    const updateTokenPosition = useGameStore(state => state.updateTokenPosition);

    const handleKeyDown = useCallback((event) => {
        if (creature.type !== "player" || !token) return;
        
        let newX = token.position.x;
        let newY = token.position.y;
        
        switch (event.key) {
            case "ArrowUp":
                newY -= tileSize;
                break;
            case "ArrowDown":
                newY += tileSize;
                break;
            case "ArrowLeft":
                newX -= tileSize;
                break;
            case "ArrowRight":
                newX += tileSize;
                break;
            default:
                return;
        }
        
        updateTokenPosition(creature.id, { x: newX, y: newY });
    }, [creature.id, creature.type, token, tileSize, updateTokenPosition]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (!token) return null;

    const getTokenColor = () => {
        switch (creature.type) {
            case "player":
                return "#4a90e2";
            case "monster":
                return "#e25555";
            case "boss":
                return "#8b0000";
            default:
                return "#888888";
        }
    };

    return (
        <div className={`token ${creature.type}`}
            style={{
                position: "absolute",
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                left: `${token.position.x}px`,
                top: `${token.position.y}px`,
                backgroundColor: getTokenColor(),
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                cursor: "pointer",
                userSelect: "none",
                transition: "all 0.2s ease-out"
            }}>
            {creature.name}
        </div>
    );
}
