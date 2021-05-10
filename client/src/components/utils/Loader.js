import React from 'react';

const primaryColorScss = '#2f80ed'; // default

const Loader = ({ radius, color = primaryColorScss }) => {
    return (
        <svg className="loader" height={radius * 2 || 100} width={radius * 2 || 100}>
            <circle
                className="loader__inset"
                cx={radius * 0.8 || 50}
                cy={radius * 0.8 || 50}
                r={(radius * 0.8) / 2 || 25}
                strokeWidth={radius * 0.03}
                stroke={color}
            />
            <circle
                className="loader__around"
                cx={radius || 50}
                cy={radius || 50}
                r={radius / 2 || 25}
                strokeWidth={radius * 0.03}
                stroke={color}
            />
        </svg>
    );
};

export default Loader;
