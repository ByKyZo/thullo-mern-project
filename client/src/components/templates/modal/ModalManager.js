import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardModal from './CardModal';
import ModalCreateBoard from './CreateBoard';
import Notifications from './Notifications';

export const CREATE_BOARD_MODAL = 'CREATE_BOARD_MODAL';
export const NOTIFICATIONS_MODAL = 'NOTIFICATIONS_MODAL';
export const CARD_MODAL = 'CARD_MODAL';

const ModalManager = () => {
    const { modalName, props } = useSelector((state) => state.modalReducer);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        modalName ? setIsOpen(true) : setIsOpen(false);
    }, [modalName]);

    const handleModalCall = () => {
        switch (modalName) {
            case CREATE_BOARD_MODAL:
                return <ModalCreateBoard {...props} isOpen={isOpen} setIsOpen={setIsOpen} />;
            case NOTIFICATIONS_MODAL:
                return <Notifications {...props} isOpen={isOpen} setIsOpen={setIsOpen} />;
            case CARD_MODAL:
                return <CardModal {...props} isOpen={isOpen} setIsOpen={setIsOpen} />;
            default:
                return <> </>;
        }
    };

    return handleModalCall();
};

export default ModalManager;
