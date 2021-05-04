import React, { useState } from 'react';
import AuthWrapper from '../../components/templates/AuthWrapper.js';
import Button from '../../components/utils/Button';
import { Link } from 'react-router-dom';

const Login = (props) => {
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const handleLogin = (e) => {
        e.preventDefault();
    };

    return (
        <AuthWrapper>
            <form className="auth__component" onSubmit={handleLogin}>
                <h1 className="auth__title">Login</h1>
                <div className="auth__input__wrapper">
                    <input
                        className="auth__input"
                        type="email"
                        placeholder="Email"
                    />
                </div>
                <div className="auth__input__wrapper">
                    <input
                        className="auth__input"
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <Button className="auth__btn">Connexion</Button>
                <p className="auth__has-account">
                    You don't have account ?{' '}
                    <Link to="/register">Register</Link>
                </p>
            </form>
        </AuthWrapper>
    );
};

export default Login;
