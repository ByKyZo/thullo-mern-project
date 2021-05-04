import React from 'react';

const styleSubContainer = {
    height: '80vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const AuthWrapper = ({ children }) => {
    return (
        <div className="auth">
            <div style={styleSubContainer}>{children}</div>
        </div>
    );
};

export default AuthWrapper;
