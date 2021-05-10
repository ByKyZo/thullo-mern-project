import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Footer from '../components/templates/Footer';
import Home from '../pages/Home';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Board from '../pages/Board';
import { useSelector } from 'react-redux';
import { isEmpty } from '../utils/utils';
import PrivateRoute from '../components/routes/PrivateRoute.js';

const MainRouter = (props) => {
    const user = useSelector((state) => state.userReducer);
    const isLoading = useSelector((state) => state.loaderReducer);

    // FAIRE UNE ROUTE PRIVE POUR REDIGER VERS LOGIN SI PAS AUTH
    // ET ETRE REDIGE SUR LA PAGE ACTUEL SANS BUG (CAR ACTULLEMENT BUG 1 FOIS SUR 5...)

    return (
        <>
            <Router>
                {!isLoading && isEmpty(user) && <Redirect to="/login" />}
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <PrivateRoute exact path="/board/:id" component={Board} />
                    <PrivateRoute exact path="/allboards" component={Home} />

                    {!isLoading && !isEmpty(user) && <Redirect to="/allboards" />}
                </Switch>
                <Footer />
            </Router>
        </>
    );
};

export default MainRouter;
