import React, { useState } from 'react';
import '../../styles/category-dialog.css';

const WOW_ICONS = [
    'inv_misc_bag_08',
    'inv_misc_bag_10',
    'inv_misc_bag_11',
    'inv_misc_bag_12',
    'inv_misc_bag_13',
    'inv_misc_bag_14',
    'inv_misc_bag_15',
    'inv_misc_bag_16',
    'inv_misc_bag_17',
    'inv_misc_bag_18',
    'inv_misc_bag_19',
    'inv_misc_bag_20',
    'inv_misc_bag_21',
    'inv_misc_bag_22',
    'inv_misc_bag_23',
    'inv_misc_bag_24',
    'inv_misc_bag_25',
    'inv_misc_bag_26',
    'inv_misc_bag_27',
    'inv_misc_bag_28',
    'inv_misc_bag_29',
    'inv_misc_bag_30'
];

const CategoryDialog = ({ onComplete, onCancel, parentId }) => {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(WOW_ICONS[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onComplete({
                name: name.trim(),
                parentId,
                icon: selectedIcon
            });
        }
    };

    return (
        <div className="category-dialog-overlay">
            <div className="category-dialog">
                <div className="category-dialog-header">
                    <h2>New Category</h2>
                    <button className="category-dialog-close" onClick={onCancel}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="category-dialog-content">
                        <div className="form-group">
                            <label htmlFor="categoryName">Name</label>
                            <input
                                id="categoryName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter category name"
                                autoFocus
                            />
                        </div>
                        <div className="form-group">
                            <label>Icon</label>
                            <div className="icon-grid">
                                {WOW_ICONS.map((icon) => (
                                    <div
                                        key={icon}
                                        className={`icon-option ${selectedIcon === icon ? 'selected' : ''}`}
                                        onClick={() => setSelectedIcon(icon)}
                                    >
                                        <img 
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`} 
                                            alt={icon}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="category-dialog-footer">
                        <button type="button" onClick={onCancel}>Cancel</button>
                        <button type="submit" disabled={!name.trim()}>Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryDialog;
