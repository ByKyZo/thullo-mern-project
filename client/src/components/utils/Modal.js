import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import Button from '../utils/Button';
import { IoClose } from 'react-icons/io5';

const Modal = ({ children, hasCloseButton = false, isOpen, setIsOpen }) => {
    const [isOpenContent, setIsOpenContent] = useState(false);
    const modalRef = useRef();

    useEffect(() => {
        if (isOpen) return (document.querySelector('html').style = 'overflow : hidden');
        return (document.querySelector('html').style = 'overflow : visible');
    }, [isOpen]);

    useEffect(() => {
        const handleCloseModal = (e) => {
            if (!modalRef.current) return () => setIsOpen(false);

            !modalRef.current.contains(e.target) && setIsOpen(false);
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
                onExited={() => setIsOpen(false)}
                unmountOnExit>
                <div className="modal">
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
                        </div>
                    </CSSTransition>
                </div>
            </CSSTransition>
        </>
    );
};

export default Modal;
