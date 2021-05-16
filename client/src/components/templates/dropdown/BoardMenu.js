import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import DropDown from '../../utils/Dropdown';
import { CgClose } from 'react-icons/cg';
import { MdEdit, MdDescription } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { getPicturePath, isEmpty } from '../../../utils/utils';
import socket from '../../../utils/socket';
import EditDescription from '../modal/EditDescription';

const BoardMenu = ({ isOpen, setIsOpen }) => {
    const descriptionRef = useRef();
    const boardMenuRef = useRef();
    const board = useSelector((state) => state.boardReducer.currentBoard);
    const [isEditDescription, setIsEditDescription] = useState(false);

    const handleBanMember = (memberBannedID) => {
        const banMemberObject = {
            boardID: board._id,
            memberBannedID,
        };

        socket.emit('ban member', banMemberObject);
    };

    useEffect(() => {
        if (!isEmpty(board.description) && descriptionRef.current) {
            descriptionRef.current.innerHTML = board.description;
        }
    }, [board.description, isOpen]);

    return (
        <>
            <DropDown
                isVertical={false}
                contentRef={boardMenuRef}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                top="-4px"
                right="-8px">
                <div className="boardmenu" ref={boardMenuRef}>
                    <div className="boardmenu__top">
                        <h3 className="boardmenu__top__name">{board.name}</h3>
                        <button
                            className="boardmenu__top__btn-close"
                            onClick={() => setIsOpen(false)}>
                            <CgClose />
                        </button>
                    </div>
                    <div className="boardmenu__content">
                        <div className="boardmenu__content__creator">
                            <span className="boardmenu__content__title">
                                <FaUserCircle className="boardmenu__content__title__icon" />
                                <span className="boardmenu__content__title__label">Made by</span>
                            </span>
                            <div className="boardmenu__content__creator__profil">
                                <img
                                    className="boardmenu__content__creator__profil__img"
                                    src={
                                        !isEmpty(board) &&
                                        getPicturePath('user', board.owner.picture)
                                    }
                                    alt={`owner ${!isEmpty(board) && board.owner.pseudo}`}
                                />
                                <div className="boardmenu__content__creator__profil__infos">
                                    <span className="boardmenu__content__creator__profil__infos__name">
                                        {!isEmpty(board) && board.owner.pseudo}
                                    </span>
                                    <span className="boardmenu__content__creator__profil__infos__date">
                                        on 4 July, 2020
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="boardmenu__content__description">
                            <div className="boardmenu__content__description__top">
                                <span className="boardmenu__content__title">
                                    <MdDescription className="boardmenu__content__title__icon" />
                                    <span className="boardmenu__content__title__label">
                                        Description
                                    </span>
                                </span>
                                {!isEditDescription && (
                                    <button
                                        className="boardmenu__content__description__top__btn-edit"
                                        onClick={() => setIsEditDescription(!isEditDescription)}>
                                        <MdEdit className="boardmenu__content__description__top__btn-edit__icon" />
                                        <span>Edit</span>
                                    </button>
                                )}
                            </div>
                            {isEditDescription ? (
                                <EditDescription
                                    boardID={board._id}
                                    description={board.description}
                                    isOpen={isEditDescription}
                                    setIsOpen={setIsEditDescription}
                                />
                            ) : (
                                <p
                                    ref={descriptionRef}
                                    className="boardmenu__content__description__para">
                                    {/* {board.description} */}
                                </p>
                            )}
                        </div>
                        <div className="boardmenu__content__team">
                            <div className="boardmenu__content__team__top">
                                <span className="boardmenu__content__title">
                                    <MdDescription className="boardmenu__content__title__icon" />
                                    <span className="boardmenu__content__title__label">Team</span>
                                </span>
                            </div>
                            <ul className="boardmenu__content__team__list">
                                {!isEmpty(board) &&
                                    board.members.map((member, index) => {
                                        return (
                                            <li
                                                key={member._id}
                                                className="boardmenu__content__team__list__item"
                                                style={{
                                                    marginBottom:
                                                        index === board.members.length - 1
                                                            ? ''
                                                            : '15px',
                                                }}>
                                                <img
                                                    className="boardmenu__content__team__list__item__img"
                                                    src={getPicturePath('user', member.picture)}
                                                    alt=""
                                                />
                                                <span className="boardmenu__content__team__list__item__pseudo">
                                                    {member.pseudo}
                                                </span>
                                                {board.owner._id === member._id ? (
                                                    <span className="boardmenu__content__team__list__item__admin">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="boardmenu__content__team__list__item__btn-remove"
                                                        onClick={() => handleBanMember(member._id)}>
                                                        Remove
                                                    </button>
                                                )}
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                    </div>
                </div>
            </DropDown>
        </>
    );
};

export default BoardMenu;
