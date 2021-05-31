import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import Button from '../utils/Button';
import { IoClose } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/actions/modal.action';

const Modal = ({
    children,
    hasCloseButton = false,
    isOpen,
    setIsOpen,
    hasOverflowYScroll = false,
    hasChoiceButton = false,
    btnConfirmMessage,
    btnConfirmIcon,
    confirmMessage,
    confirmFunction,
}) => {
    const [isOpenContent, setIsOpenContent] = useState(false);
    const modalRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen) return (document.querySelector('html').style = 'overflow : hidden');
        return (document.querySelector('html').style = 'overflow : visible');
    }, [isOpen]);

    useEffect(() => {
        const handleCloseModal = (e) => {
            if (!modalRef.current) {
                return setIsOpen(false);
            }

            if (!modalRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        window.addEventListener('mousedown', handleCloseModal);

        return () => {
            window.removeEventListener('mousedown', handleCloseModal);
            document.querySelector('html').style = 'overflow : visible';
        };
    }, [setIsOpen]);

    return (
        <>
            <CSSTransition
                in={isOpen}
                classNames="modal"
                appear={true}
                timeout={200}
                onEntered={() => setIsOpenContent(true)}
                onExit={() => setIsOpenContent(false)}
                onExited={() => {
                    dispatch(closeModal());
                    setIsOpen(false);
                }}
                unmountOnExit>
                <div
                    className="modal"
                    style={{ alignItems: hasOverflowYScroll ? 'flex-start' : 'center' }}>
                    <CSSTransition
                        in={isOpenContent}
                        classNames="modalcontent"
                        appear={true}
                        timeout={300}
                        unmountOnExit>
                        <div ref={modalRef} className="modal__content">
                            {hasCloseButton && (
                                <Button
                                    className="modal__content__close"
                                    onClick={() => setIsOpen(false)}>
                                    <IoClose />
                                </Button>
                            )}

                            {children}

                            {hasChoiceButton && (
                                <>
                                    <p className="modal__content__confirm-message">
                                        {confirmMessage}
                                    </p>
                                    <div className="modal__content__btn-wrapper">
                                        <Button
                                            className="modal__content__btn-wrapper__cancel"
                                            onClick={() => setIsOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            className="modal__content__btn-wrapper__confirm"
                                            onClick={confirmFunction}>
                                            {btnConfirmIcon && (
                                                <span className="modal__content__btn-wrapper__confirm__icon">
                                                    {btnConfirmIcon}
                                                </span>
                                            )}
                                            <span className="modal__content__btn-wrapper__confirm__label">
                                                {btnConfirmMessage ? btnConfirmMessage : 'Confirm'}
                                            </span>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </CSSTransition>
                </div>
            </CSSTransition>
        </>
    );
};

export default Modal;
