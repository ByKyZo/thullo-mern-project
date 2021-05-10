import React from 'react';
import Toast from '../utils/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { removeToast } from '../../redux/actions/toast.action';

const PopupManagerStyle = {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '9999999',
    listStyle: 'none',
    wordBreak: 'break-all',
    maxHeight: '100vh',
};

const PopupManager = (props) => {
    const toasts = useSelector((state) => state.toastReducer);
    const dispatch = useDispatch();

    return (
        <ul style={PopupManagerStyle}>
            <TransitionGroup>
                {toasts.map((toast, index) => {
                    return (
                        <CSSTransition
                            // unmountOnExit
                            key={index}
                            appear={true}
                            timeout={300}
                            classNames="toast">
                            <Toast
                                key={index + 1}
                                icon={toast.icon}
                                info={toast.info}
                                type={toast.type}
                                onClick={() => dispatch(removeToast(toast.id))}
                            />
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        </ul>
    );
};

export default PopupManager;
