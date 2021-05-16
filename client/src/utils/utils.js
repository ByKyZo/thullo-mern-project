import { Cookies } from 'react-cookie';
import { clearToast, pushToast } from '../redux/actions/toast.action';
import { store } from '../redux/store';
import { RiErrorWarningLine } from 'react-icons/ri';
import { FiCheckCircle } from 'react-icons/fi';
import { API_URL } from '../config';
import { clearRedirect, redirect } from '../redux/actions/redirect.action';

export const isEmpty = (value) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
};

export const setRememberMeCookie = async (token) => {
    const cookie = new Cookies();
    // cookie.remove('token', { path: '/' });
    cookie.set('token', token, { maxAge: 604800000 }); // 1 week ?
};

export const errorsManager = (err) => {
    for (const error in err) {
        addToast(<RiErrorWarningLine />, err[error], 'danger');
    }
};

export const addToast = (icon, info, type) => {
    store.dispatch(pushToast(icon, info, type));
};

export const clearToastByTypes = (type) => {
    store.dispatch(clearToast(type));
};
export const warningToast = (message) => {
    clearToastByTypes(['danger', 'warning']);
    addToast(<RiErrorWarningLine />, message, 'warning');
};
export const successToast = (message) => {
    clearToastByTypes(['danger', 'warning']);
    addToast(<FiCheckCircle />, message, 'success');
};

export const getPicturePath = (model, image) => {
    switch (model) {
        case 'board':
            return `${API_URL}/board-picture/${image}`;
        case 'user':
            return `${API_URL}/user-picture/${image}`;
        default:
            console.log('Picture Path Error');
    }
};

export const redirectTo = (to) => {
    store.dispatch(redirect(to));
    // setTimeout(() => {
    store.dispatch(clearRedirect());
    // }, 500);
};

export const insertSpecialCharacter = (ref, character, html = false) => {
    var doc = ref.current.ownerDocument.defaultView;

    var sel = doc.getSelection();
    var range = sel.getRangeAt(0);

    // var tabNode = document.createTextNode(
    //     html ? String.fromCodePoint(character) : String.fromCharCode(character)
    // ); // code point
    var tabNode = document.createTextNode(String.fromCharCode(character)); // code point

    range.insertNode(tabNode);

    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    sel.removeAllRanges();
    sel.addRange(range);
};
