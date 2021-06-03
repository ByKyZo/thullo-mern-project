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
        case 'attachment':
            return `${API_URL}/attachment/${image}`;
        default:
            console.log('getPicturePath() -> Picture Path Error');
    }
};

export const redirectTo = (to) => {
    store.dispatch(redirect(to));
    // setTimeout(() => {
    store.dispatch(clearRedirect());
    // }, 500);
};

export const insertSpecialCharacter = (ref, character) => {
    var doc = ref.current.ownerDocument.defaultView;

    var sel = doc.getSelection();
    var range = sel.getRangeAt(0);

    var tabNode = document.createTextNode(String.fromCodePoint(character)); // code point

    range.insertNode(tabNode);

    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    sel.removeAllRanges();
    sel.addRange(range);
};

export const removeHTMLtags = (html) => {
    return html.replaceAll(/(<([^>]+)>)/gi, '');
};

export const removeHtmlClass = (html) => {
    return html.replaceAll(/class="[a-zA-Z0-9:;.\s()\-,]*"/gi, '');
    // return html.replaceAll(/class="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi, '');
};

export const removeHtmlStyle = (html) => {
    return html.replaceAll(/(<[^>]+) style=".*?"/gi, '');
};

export const removeHtmlAttributes = (html) => {
    return html.replaceAll(/<\s*(\w+).*?>/gi, '');
};

export const closeOnClickOutside = (ref, setIsOpen) => {
    const handleCloseModal = (e) => {
        if (!ref.current) return () => setIsOpen(false);

        !ref.current.contains(e.target) && setIsOpen(false);
    };

    window.addEventListener('mousedown', handleCloseModal);
};

export const reorderArray = (currentIndex, destinationIndex, array) => {
    let newArray = [...array];
    const [reorderList] = newArray.splice(currentIndex, 1);
    newArray.splice(destinationIndex, 0, reorderList);
    return newArray;
};

export const getDraggedDom = (draggableID) => {
    const dataName = 'data-rbd-draggable-id';
    const draggedEl = document.querySelector(`[${dataName}=${draggableID}]`);
    return draggedEl;
};

export const cutMongooseTimestampInDate = (mongooseTimestamp) => {
    const month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const noFormatDate = mongooseTimestamp;

    //  YEAR
    const years = noFormatDate.substring(0, 4);

    //  MONTH
    const monthNum =
        noFormatDate[5] === '0' ? noFormatDate.substring(6, 7) : noFormatDate.substring(5, 7);
    const monthLetter = month[monthNum - 1];

    //  DAY
    const dayNum = noFormatDate.substring(8, 10);
    const dayLetter = days[dayNum];

    // HOUR
    const hour = noFormatDate.substring(11, 16);

    return { hour, dayNum, dayLetter, monthNum, monthLetter, years };
};
