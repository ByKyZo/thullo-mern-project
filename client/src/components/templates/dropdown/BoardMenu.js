import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import DropDown from '../../utils/Dropdown';
import { CgClose } from 'react-icons/cg';
import { MdEdit, MdDescription } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { cutMongooseTimestampInDate, getPicturePath, isEmpty } from '../../../utils/utils';
import socket from '../../../utils/socket';
import ContentEditable from '../ContentEditable';
import CategoryTitle from '../../layouts/CategoryTitle';

const BoardMenu = ({ isOpen, setIsOpen }) => {
    const descriptionRef = useRef();
    const boardMenuRef = useRef();
    const board = useSelector((state) => state.boardReducer.currentBoard);
    const user = useSelector((state) => state.userReducer);
    const [isEditDescription, setIsEditDescription] = useState(false);

    const isBoardOwner = () => {
        return !isEmpty(user) && !isEmpty(board) && board.owner._id === user._id;
    };

    const handleFormatDate = () => {
        if (isEmpty(board)) return;
        const { dayNum, monthLetter, years } = cutMongooseTimestampInDate(board.createdAt);
        return `on ${dayNum} ${monthLetter}, ${years} `;
    };

    const handleBanMember = (memberBannedID) => {
        const banMemberObject = {
            boardID: board._id,
            memberBannedID,
        };
        socket.emit('ban member', banMemberObject);
    };

    const handleSaveDescription = (newDesc) => {
        socket.emit('change description', { description: newDesc, boardID: board._id });
        setIsEditDescription(false);
    };

    const handleLeaveBoard = () => {
        const leaveBoardObject = {
            userID: user._id,
            boardID: board._id,
        };
        socket.emit('leave board', leaveBoardObject);
    };

    const handleDeleteBoard = () => {
        const boardID = board._id;
        socket.emit('delete board', boardID);
    };
    useEffect(() => {
        if (!isEmpty(board.description) && descriptionRef.current) {
            descriptionRef.current.innerHTML = board.description;
        }
    }, [board.description, isOpen, isEditDescription]);

    return (
        <>
            <DropDown
                isVertical={false}
                contentRef={boardMenuRef}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                top="0"
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
                            <CategoryTitle icon={<FaUserCircle />} title="Made by" />
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
                                        {handleFormatDate()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="boardmenu__content__description">
                            <div className="boardmenu__content__description__top">
                                <CategoryTitle
                                    icon={<MdDescription />}
                                    title="Description"
                                    withMarginBottom={false}
                                />
                                {!isEditDescription && isBoardOwner() && (
                                    <button
                                        className="boardmenu__content__description__top__btn-edit"
                                        onClick={() => setIsEditDescription(!isEditDescription)}>
                                        <MdEdit className="boardmenu__content__description__top__btn-edit__icon" />
                                        <span>Edit</span>
                                    </button>
                                )}
                            </div>
                            {isEditDescription ? (
                                <ContentEditable
                                    content={board.description}
                                    submitFunc={handleSaveDescription}
                                    setIsOpen={setIsEditDescription}
                                />
                            ) : (
                                <p
                                    ref={descriptionRef}
                                    className="boardmenu__content__description__para"></p>
                            )}
                        </div>
                        <div className="boardmenu__content__team">
                            <CategoryTitle icon={<MdDescription />} title="Team" />
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
                                                    isBoardOwner() && (
                                                        <button
                                                            className="boardmenu__content__team__list__item__btn-remove"
                                                            onClick={() =>
                                                                handleBanMember(member._id)
                                                            }>
                                                            Remove
                                                        </button>
                                                    )
                                                )}
                                            </li>
                                        );
                                    })}
                            </ul>
                        </div>
                        <button
                            className="boardmenu__content__btn-leave"
                            onClick={() => handleLeaveBoard()}>
                            Leave
                        </button>
                        {isBoardOwner() && (
                            <button
                                className="boardmenu__content__btn-delete"
                                onClick={() => handleDeleteBoard()}>
                                Delete Board
                            </button>
                        )}
                    </div>
                </div>
            </DropDown>
        </>
    );
};

export default BoardMenu;
