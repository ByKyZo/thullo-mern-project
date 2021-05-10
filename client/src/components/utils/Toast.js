import React from 'react';

const Toast = ({ icon, info, type, onClick, style }) => {
    return (
        <li style={style} className={`toast toast-${type}`} onClick={onClick}>
            <div className="toast__icon">{icon}</div>
            <span className="toast__info">{info}</span>
        </li>
    );
};

export default Toast;
