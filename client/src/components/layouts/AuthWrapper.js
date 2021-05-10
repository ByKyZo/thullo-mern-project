import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { isEmpty } from '../../utils/utils';
import ThulloLogo from '../../assets/images/Logo.svg';

const authContainer = {
    height: '80vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const logo = {
    height: '50px',
    position: 'absolute',
    top: '15px',
    left: '15px',
};

const AuthWrapper = ({ children }) => {
    const user = useSelector((state) => state.userReducer);

    return (
        <>
            {!isEmpty(user) && <Redirect to="/allboards" />}
            <div className="auth">
                <img style={logo} src={ThulloLogo} alt="Thullo" />
                <div style={authContainer}>{children}</div>
            </div>
        </>
    );
};

export default AuthWrapper;
