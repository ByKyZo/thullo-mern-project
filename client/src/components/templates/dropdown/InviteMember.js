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
    const user = useSelector((state) => state.userReducer);
    const [usersToInvite, setUsersToInvite] = useState([]);
    const [userSelected, setUserSelected] = useState([]);
    const [userSearch, setUserSearch] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {

        if (!isEmpty(currentBoard)) {
            axios
                .get(`/user/all/${currentBoard._id}`)
                .then((res) => {
                    setUsersToInvite(res.data);
                    setUserSearch(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [currentBoard]);

    const handleSearchUser = () => {
        setUserSearch(usersToInvite.filter((user) => user.pseudo.includes(searchValue)));
    };

    const handleSendInvation = () => {
        const invitationObject = {
            senderPseudo: user.pseudo,
            guestUserIDList: userSelected,
            boardID: currentBoard._id,
            boardName: currentBoard.name,
        };
        setUsersToInvite(usersToInvite.filter((userSug) => !userSelected.includes(userSug._id)));
        setUserSearch(userSearch.filter((userSug) => !userSelected.includes(userSug._id)));
        socket.emit('send invitation', invitationObject);
    };

    const handleSelectUser = (id) => {
        userSelected.findIndex((userID) => userID === id) === -1
            ? setUserSelected([...userSelected, id])
            : setUserSelected(userSelected.filter((userID) => userID !== id));
    };

    return (
        <DropDown
            contentClass="invitemember"
            isResponsive={true}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            top="46px"
            left="-4px"
            title="Invite to Board"
            description="Search users you want to invite to">
            <div className="invitemember__input__wrapper">
                <input
                    className="invitemember__input__wrapper__input"
                    placeholder="User..."
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button
                    className="invitemember__input__wrapper__btn"
                    onClick={() => handleSearchUser()}>
                    <HiOutlineSearch />
                </Button>
            </div>
            {!isEmpty(userSearch) && (
                <ul className="invitemember__suggest">
                    {userSearch.map(({ _id, pseudo, picture }, index) => {
                        return (
                            <li
                                key={_id}
                                style={{
                                    marginBottom: index === userSearch.length - 1 ? '' : '15px',
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
            )}

            <Button
                className={`invitemember__btn-invite ${
                    isEmpty(userSelected) ? 'invitemember__btn-invite--disabled' : ''
                }`}
                onClick={() => !isEmpty(userSelected) && handleSendInvation()}>
                Invite
            </Button>
        </DropDown>
    );
};

export default InviteMember;
