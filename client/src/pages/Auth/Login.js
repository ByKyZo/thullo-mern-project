import React, { useState } from 'react';
import AuthWrapper from '../../components/layouts/AuthWrapper.js';
import Button from '../../components/utils/Button';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/user.action';
import PageTemplate from '../../components/templates/PageTemplate.js';

const Login = (props) => {
    const dispatch = useDispatch();
    const [userLogin, setUserLogin] = useState({
        email: '',
        password: '',
    });

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login(userLogin));
    };

    return (
        <PageTemplate pageTitle="Login" hasHeader={false}>
            <AuthWrapper>
                <form className="auth__component" onSubmit={handleLogin} noValidate>
                    <h1 className="auth__title">Login</h1>
                    <div className="auth__input__wrapper">
                        <input
                            className="auth__input"
                            type="email"
                            placeholder="Email"
                            value={userLogin.email}
                            autoComplete="on"
                            onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })}
                        />
                    </div>
                    <div className="auth__input__wrapper">
                        <input
                            className="auth__input"
                            type="password"
                            placeholder="Password"
                            value={userLogin.password}
                            onChange={(e) =>
                                setUserLogin({ ...userLogin, password: e.target.value })
                            }
                        />
                    </div>
                    <Button className="auth__btn">Connexion</Button>
                    <p className="auth__has-account">
                        You don't have account ? <Link to="/register">Register</Link>
                    </p>
                </form>
            </AuthWrapper>
        </PageTemplate>
    );
};

export default Login;
