import React from 'react';

const CategoryTitle = ({ icon, title, withMarginBottom = true }) => {
    return (
        <div className="categorytitle" style={{ marginBottom: withMarginBottom ? '16px' : '0' }}>
            <span className="categorytitle__icon">{icon}</span>
            <span className="categorytitle__label">{title}</span>
        </div>
    );
};

export default CategoryTitle;
