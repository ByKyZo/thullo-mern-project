import React from 'react';
import { MdNotifications, MdCheck } from 'react-icons/md';
import { IoMdTrash } from 'react-icons/io';
import Modal from '../../utils/Modal';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import Button from '../../utils/Button';
import { isEmpty } from '../../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNotification } from '../../../redux/actions/user.action';
import socket from '../../../utils/socket';

const Notifications = ({ isOpen, setIsOpen }) => {
    const user = useSelector((state) => state.userReducer);
    const dispatch = useDispatch();

    const handleJoinBoard = (boardID, notificationID) => {
        const joinBoardObject = {
            userID: user._id,
            boardID,
        };
        socket.emit('join board', joinBoardObject);
        dispatch(deleteNotification(user._id, notificationID));
    };

    return (
        <>
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} hasCloseButton={true}>
                <div className="profilmenu__notifications">
                    <span className="profilmenu__notifications__top">
                        <MdNotifications className="profilmenu__notifications__top__icon" />
                        Notifications
                    </span>
                    <ul className="profilmenu__notifications__list">
                        {!isEmpty(user.notifications) ? (
                            user.notifications.map(({ _id, title, message, boardIDRequested }) => {
                                return (
                                    <li key={_id} className="profilmenu__notifications__list__item">
                                        <div className="profilmenu__notifications__list__item__right">
                                            <AiOutlineAppstoreAdd className="profilmenu__notifications__list__item__right__icon" />
                                            <div className="profilmenu__notifications__list__item__right__content">
                                                <span className="profilmenu__notifications__list__item__right__content__title">
                                                    {title}
                                                </span>
                                                <span className="profilmenu__notifications__list__item__right__content__message">
                                                    {message}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="profilmenu__notifications__list__item__left">
                                            <Button
                                                className="profilmenu__notifications__list__item__left__btn-valid"
                                                onClick={() =>
                                                    handleJoinBoard(boardIDRequested, _id)
                                                }>
                                                <MdCheck />
                                            </Button>
                                            <Button
                                                className="profilmenu__notifications__list__item__left__btn-wrong"
                                                onClick={() =>
                                                    dispatch(
                                                        deleteNotification(
                                                            user._id,
                                                            _id,
                                                            boardIDRequested
                                                        )
                                                    )
                                                }>
                                                <IoMdTrash />
                                            </Button>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <h4 style={{ textAlign: 'center', marginTop: '20px' }}>
                                You don't have notifications
                            </h4>
                        )}
                    </ul>
                </div>
            </Modal>
        </>
    );
};

export default Notifications;
