import React from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';

const labelStyle = {
    fontSize: '0.8rem',
    borderRadius: '9999px',
    padding: '4px 10px',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
};

const CardLabel = ({ name, color, style, isDeleted = false, onClick }) => {
    const handleCheckName = () => {
        if (name.length > 30) return;
        // AFFICHER ... SI LA CARD EST TROP LONGUE
    };

    const handleOnClick = () => {
        onClick && onClick();
    };

    return (
        <span
            className={`cardlabel ${isDeleted ? 'cardlabeldeletable' : ''}`}
            onClick={() => handleOnClick()}
            style={{
                ...labelStyle,
                ...style,
                backgroundColor: `rgba(${color},0.3)`,
                color: `rgb(${color})`,
            }}>
            {name}
            {isDeleted && <IoIosCloseCircleOutline style={{ marginLeft: '6px' }} />}
        </span>
    );
};

export default CardLabel;
