import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { isEmpty } from '../../utils/utils';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const user = useSelector((state) => state.userReducer);

    return (
        <Route
            {...rest}
            render={(props) =>
                !isEmpty(!user) ? <Component /> : <Redirect to="/login" />
            }></Route>
    );
};

export default PrivateRoute;
