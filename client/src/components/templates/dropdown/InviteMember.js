import React, { useEffect, useState } from 'react';
import DropDown from '../../utils/Dropdown';
import Button from '../../utils/Button';
import { HiOutlineSearch } from 'react-icons/hi';
import axios from '../../../utils/axios';
import { useSelector } from 'react-redux';
import { getPicturePath, isEmpty } from '../../../utils/utils';
import { IoAddCircleOutline } from 'react-icons/io5';
import { FiCheckCircle } from 'react-icons/fi';
import socket from '../../../utils/socket';

const InviteMember = ({ isOpen, setIsOpen }) => {
    const currentBoard = useSelector((state) => state.boardReducer.currentBoard);
    const [userSuggest, setUserSuggest] = useState([]);
    const [userSelected, setUserSelected] = useState([]);
    // const [isOpenUsersSuggest, setIsOpenUsersSuggest] = useState(false);

    useEffect(() => {
        if (!isEmpty(currentBoard)) {
            axios
                .get(`/user/all/${currentBoard._id}`)
                .then((res) => {
                    setUserSuggest(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [currentBoard]);

    const handleSendInvation = () => {
        const invitationObject = {
            guestUserIDList: userSelected,
            boardID: currentBoard._id,
        };
        socket.emit('send invitation', invitationObject);
    };

    const handleSelectUser = (id) => {
        userSelected.findIndex((userID) => userID === id) === -1
            ? setUserSelected([...userSelected, id])
            : setUserSelected(userSelected.filter((userID) => userID !== id));
    };

    return (
        <DropDown isReponsive={true} isOpen={isOpen} setIsOpen={setIsOpen} top="50px">
            <div className="invitemember">
                <span className="invitemember__title">Invite to Board</span>
                <p className="invitemember__para">Search users you want to invite to</p>
                <div className="invitemember__input__wrapper">
                    <input
                        className="invitemember__input__wrapper__input"
                        placeholder="User..."
                        type="text"
                    />
                    <Button className="invitemember__input__wrapper__btn">
                        <HiOutlineSearch />
                    </Button>
                </div>

                <ul className="invitemember__suggest">
                    {userSuggest.map(({ _id, pseudo, picture }, index) => {
                        return (
                            <li
                                key={_id}
                                className=""
                                style={{
                                    marginBottom: index === userSuggest.length - 1 ? '' : '15px',
                                }}>
                                <button
                                    className="invitemember__suggest__item"
                                    onClick={() => handleSelectUser(_id)}>
                                    <img
                                        className="invitemember__suggest__item__picture"
                                        src={getPicturePath('user', picture)}
                                        alt={`user ${pseudo}`}
                                    />
                                    <span className="invitemember__suggest__item__pseudo">
                                        {pseudo}
                                    </span>
                                    {userSelected.includes(_id) ? (
                                        <FiCheckCircle className="invitemember__suggest__item__icon invitemember__suggest__item__icon--select" />
                                    ) : (
                                        <IoAddCircleOutline className="invitemember__suggest__item__icon" />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <Button
                    className={`invitemember__btn-invite ${
                        isEmpty(userSelected) ? 'invitemember__btn-invite--disabled' : ''
                    }`}
                    onClick={() => !isEmpty(userSelected) && handleSendInvation()}>
                    Invite
                </Button>
            </div>
        </DropDown>
    );
};

export default InviteMember;
