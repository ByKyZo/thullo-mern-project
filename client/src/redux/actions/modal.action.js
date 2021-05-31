export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const openModal = (modalName, props) => {
    return (dispatch) => {
        return dispatch({ type: OPEN_MODAL, payload: { modalName, props } });
    };
};

export const closeModal = (props) => {
    return (dispatch) => {
        return dispatch({ type: CLOSE_MODAL, payload: props });
    };
};
