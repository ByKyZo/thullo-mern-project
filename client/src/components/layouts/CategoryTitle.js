import React from 'react';

const CategoryTitle = ({
    icon,
    title,
    withMarginBottom = true,
    wrapperClass = '',
    spanClass = '',
    iconClass = '',
}) => {
    return (
        <div
            className={`categorytitle ${wrapperClass}`}
            style={{ marginBottom: withMarginBottom ? '16px' : '0' }}>
            <span className={`categorytitle__icon ${iconClass}`}>{icon}</span>
            <span className={`categorytitle__label ${spanClass}`}>{title}</span>
        </div>
    );
};

export default CategoryTitle;
