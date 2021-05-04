import React from 'react';
import AuthWrapper from '../../components/templates/AuthWrapper';
import Button from '../../components/utils/Button';
import { Link } from 'react-router-dom';

const Register = (props) => {
    return (
        <AuthWrapper>
            <form className="auth__component">
                <h1 className="auth__title">Register</h1>
                <div className="auth__input__wrapper">
                    <input
                        className="auth__input"
                        type="text"
                        placeholder="Pseudo"
                    />
                </div>
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
                </div>{' '}
                <div className="auth__input__wrapper">
                    <input
                        className="auth__input"
                        type="password"
                        placeholder="Confirm Password"
                    />
                </div>
                <Button className="auth__btn">Register</Button>
                <p className="auth__has-account">
                    You have already account ?{' '}
                    <Link to="/login">Connexion</Link>
                </p>
            </form>
        </AuthWrapper>
    );
};

export default Register;
