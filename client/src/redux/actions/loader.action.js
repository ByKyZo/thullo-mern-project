export const LOADING = 'LOADING';
export const END_LOADING = 'END_LOADING';

export const loading = () => {
    return (dispatch) => {
        return dispatch({ type: LOADING, payload: true });
    };
};

export const endLoading = () => {
    return (dispatch) => {
        return dispatch({ type: END_LOADING, payload: false });
    };
};
