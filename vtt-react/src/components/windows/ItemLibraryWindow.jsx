import React, { useState } from 'react';
import WowWindow from './WowWindow';
import ItemLibrary from '../item-generation/ItemLibrary';

const ItemLibraryWindow = ({ isOpen, onClose }) => {
    const getDefaultPosition = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const width = 1000;
        const height = 700;
        return {
            x: (windowWidth - width) / 2,
            y: (windowHeight - height) / 4
        };
    };

    return (
        <ItemLibrary
            onClose={onClose}
            position={getDefaultPosition()}
        />
    );
};

export default ItemLibraryWindow;
