import React from 'react';

const button = {
    cursor: 'pointer',
};

const Button = ({ children, type, onClick, className }) => {
    return (
        <button
            type={type}
            style={button}
            className={`${className}`}
            onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
