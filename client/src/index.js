import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './scss/index.scss';
import { CookiesProvider } from 'react-cookie';
import { rememberMe } from './redux/actions/user.action';

store.dispatch(rememberMe());

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </CookiesProvider>,
    document.querySelector('#root')
);
