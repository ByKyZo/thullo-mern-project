import React from 'react';

const button = {
    cursor: 'pointer',
};

const Button = ({ children, type, onClick, className, style }) => {
    return (
        <button
            type={type}
            style={{ ...button, ...style }}
            className={`${className}`}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
