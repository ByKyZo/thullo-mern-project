import React, { useState } from 'react';
import AuthWrapper from '../../components/layouts/AuthWrapper';
import Button from '../../components/utils/Button';
import { Link, Redirect } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import PageTemplate from '../../components/templates/PageTemplate';
import { addToast, clearToastByTypes, errorsManager } from '../../utils/utils';
import { BsBookmarkCheck } from 'react-icons/bs';
import Loader from '../../components/utils/Loader';

const Register = (props) => {
    const [emailAlreadyExist, setEmailAlreadyExist] = useState({});
    const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = (user) => {
        if (isLoading) return;
        setIsLoading(true);
        axios
            .post('/user/register', user)
            .then((res) => {
                setEmailAlreadyExist({});
                clearToastByTypes(['danger', 'warning']);
                addToast(<BsBookmarkCheck />, 'Sign Up Successful', 'success');
                setIsSignUpSuccessful(true);
            })
            .catch((err) => {
                const error = err.response.data;
                errorsManager(error);
                setEmailAlreadyExist(err.response.data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const userRegister = useFormik({
        initialValues: {
            pseudo: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            pseudo: Yup.string().required('Required'),

            email: Yup.string()
                .required('Email address is required')
                .email('Invalid email address'),

            password: Yup.string().required('Password is required'),

            confirmPassword: Yup.string()
                .required('Please confirm your password')
                .oneOf([Yup.ref('password'), null], 'Password must matched'),
        }),
        onSubmit: (values) => {
            const user = {
                pseudo: values.pseudo,
                email: values.email,
                password: values.password,
            };
            handleRegister(user);
        },
    });

    return (
        <>
            {isSignUpSuccessful && <Redirect to="/login" />}

            <PageTemplate pageTitle="Register" hasHeader={false}>
                <AuthWrapper>
                    <form
                        className="auth__component"
                        onSubmit={userRegister.handleSubmit}
                        noValidate>
                        <h1 className="auth__title">Register</h1>
                        <div className="auth__input__wrapper">
                            <input
                                className="auth__input"
                                type="text"
                                {...userRegister.getFieldProps('pseudo')}
                            />
                            <span
                                className={`placeholder ${
                                    userRegister.values.pseudo && 'placeholder_active'
                                }`}>
                                Pseudo
                            </span>
                        </div>
                        {userRegister.touched.pseudo && userRegister.errors.pseudo && (
                            <p className="auth__error">{userRegister.errors.pseudo}</p>
                        )}
                        <div className="auth__input__wrapper">
                            <input
                                className="auth__input"
                                type="email"
                                {...userRegister.getFieldProps('email')}
                            />
                            <span
                                className={`placeholder ${
                                    userRegister.values.email && 'placeholder_active'
                                }`}>
                                Email
                            </span>
                        </div>
                        {userRegister.touched.email && userRegister.errors.email && (
                            <p className="auth__error">{userRegister.errors.email}</p>
                        )}
                        {emailAlreadyExist && (
                            <p className="auth__error">{emailAlreadyExist.message}</p>
                        )}
                        <div className="auth__input__wrapper">
                            <input
                                className="auth__input"
                                type="password"
                                {...userRegister.getFieldProps('password')}
                            />
                            <span
                                className={`placeholder ${
                                    userRegister.values.password && 'placeholder_active'
                                }`}>
                                Password
                            </span>
                        </div>
                        {userRegister.touched.password && userRegister.errors.password && (
                            <p className="auth__error">{userRegister.errors.password}</p>
                        )}
                        <div className="auth__input__wrapper">
                            <input
                                className="auth__input"
                                type="password"
                                {...userRegister.getFieldProps('confirmPassword')}
                            />
                            <span
                                className={`placeholder ${
                                    userRegister.values.confirmPassword && 'placeholder_active'
                                }`}>
                                Confirm Password
                            </span>
                        </div>
                        {userRegister.touched.confirmPassword &&
                            userRegister.errors.confirmPassword && (
                                <p className="auth__error">{userRegister.errors.confirmPassword}</p>
                            )}
                        <Button
                            type="submit"
                            className="auth__btn"
                            style={{ position: 'relative' }}>
                            {isLoading ? <Loader color="white" radius="28" /> : 'Register'}
                        </Button>
                        <p className="auth__has-account">
                            You have already account ? <Link to="/login">Connexion</Link>
                        </p>
                    </form>
                </AuthWrapper>
            </PageTemplate>
        </>
    );
};

export default Register;
