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

const AssignMember = ({ isOpen, setIsOpen, cardMembers, cardID, listID }) => {
    const currentBoard = useSelector((state) => state.boardReducer.currentBoard);
    const [members, setMembers] = useState([]);
    const [usersToInvite, setUsersToInvite] = useState([]);
    const [userSearch, setUserSearch] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => setMembers(cardMembers.map((member) => member._id)), [cardMembers]);

    useEffect(() => {
        if (!isEmpty(currentBoard)) {
            axios
                .post(`/board/members/${currentBoard._id}`, { cardID, listID })
                .then((res) => {
                    setUsersToInvite(res.data);
                    setUserSearch(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [isOpen, cardID, listID, currentBoard]);

    const handleSearchUser = () => {
        setUserSearch(usersToInvite.filter((user) => user.pseudo.includes(searchValue)));
    };

    const handleAssignMemberToCard = (memberID) => {
        members.findIndex((memberIDArg) => memberIDArg === memberID) === -1
            ? setMembers((oldMember) => {
                  oldMember.push(memberID);
                  const assignMemberObject = {
                      assignedMembersID: oldMember,
                      boardID: currentBoard._id,
                      listID,
                      cardID,
                  };
                  socket.emit('assign member card', assignMemberObject);
                  return [...oldMember];
              })
            : setMembers((oldMember) => {
                  oldMember = oldMember.filter((memberIDArg) => memberIDArg !== memberID);
                  const assignMemberObject = {
                      assignedMembersID: oldMember,
                      boardID: currentBoard._id,
                      listID,
                      cardID,
                  };
                  socket.emit('assign member card', assignMemberObject);
                  return [...oldMember];
              });
    };

    return (
        <DropDown
            contentClass="invitemember"
            isResponsive={true}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Members"
            description="Assign members to this card">
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
                                    onClick={() => handleAssignMemberToCard(_id)}>
                                    <img
                                        className="invitemember__suggest__item__picture"
                                        src={getPicturePath('user', picture)}
                                        alt={`user ${pseudo}`}
                                    />
                                    <span className="invitemember__suggest__item__pseudo">
                                        {pseudo}
                                    </span>
                                    {members.includes(_id) ? (
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

            {/* <Button
                className={`invitemember__btn-invite ${
                    isEmpty(userSelected) ? 'invitemember__btn-invite--disabled' : ''
                }`}
                onClick={() => !isEmpty(userSelected) && handleAssignMember()}>
                Add
            </Button> */}
        </DropDown>
    );
};

export default AssignMember;
