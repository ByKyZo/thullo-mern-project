import React, { useEffect, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';
import { useSelector } from 'react-redux';
import socket from '../../../utils/socket';
import { closeOnClickOutside } from '../../../utils/utils';

const AddListOrCard = ({
    isOpen,
    setIsOpen,
    listID,
    onClick,
    isAddList,
    isFirstList,
    isFirstCard,
    style,
    scrollBottomReset,
    scrollLeftReset,
}) => {
    const addListRef = useRef();
    const inputRef = useRef();
    const [isOpenInput, setIsOpenInput] = useState(false);
    const [name, setName] = useState('');
    const user = useSelector((state) => state.userReducer);
    const board = useSelector((state) => state.boardReducer.currentBoard);
    const currentIsOpen = isAddList ? isOpenInput : isOpen;
    const currentSetIsOpen = isAddList ? setIsOpenInput : setIsOpen;
    const boardID = board._id;

    const handleAddListOrCard = (event) => {
        event.preventDefault();

        if (!name) return inputRef.current.focus();
        const userID = user._id;

        isAddList
            ? socket.emit('add list', { name, boardID, userID })
            : socket.emit('add card', { name, boardID, listID, userID });

        setName('');
    };

    const handleOnClick = () => {
        if (!isAddList) {
            onClick && onClick();
        }
        currentSetIsOpen(true);
    };

    const handleButtonText = () => {
        return `Add ${isFirstList || isFirstCard ? '' : 'another'} ${isAddList ? 'list' : 'card'}`;
    };

    useEffect(() => {
        const currentListID = listID;
        socket.on('add list', ({ listCreated, boardID, userID }) => {
            if (userID === user._id) {
                setTimeout(() => {
                    inputRef.current && inputRef.current.focus();
                    scrollLeftReset && scrollLeftReset();
                }, 0);
            }
        });
        socket.on('add card', ({ listID, userID }) => {
            if (currentListID === listID && userID === user._id) {
                setTimeout(() => {
                    inputRef.current && inputRef.current.focus();
                    scrollBottomReset && scrollBottomReset();
                }, 0);
            }
        });
    }, [board, listID, scrollBottomReset, scrollLeftReset, user._id]);

    useEffect(() => {
        if (currentIsOpen) {
            inputRef.current && inputRef.current.focus();
            scrollLeftReset && scrollLeftReset();
            closeOnClickOutside(addListRef, currentSetIsOpen);
        }
    }, [currentIsOpen, currentSetIsOpen, scrollLeftReset]);

    return (
        <>
            {currentIsOpen ? (
                <form
                    ref={addListRef}
                    className="addlist addlist__form"
                    style={style}
                    onSubmit={(event) => handleAddListOrCard(event)}>
                    <div className="addlist__head">
                        <input
                            ref={inputRef}
                            className="addlist__input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                        />
                    </div>
                    <button type="submit" className="addlist__btn-add">
                        Add {isAddList ? 'list' : 'card'}
                    </button>
                </form>
            ) : (
                <button
                    style={{
                        ...style,
                        margin: isAddList ? '' : 'auto',
                        background: 'transparent',
                        display: 'flex',
                    }}
                    onClick={(e) => handleOnClick()}>
                    <div className="addlist">
                        <span>{handleButtonText()}</span>
                        <MdAdd className="addlist__head__icon" />
                    </div>
                </button>
            )}
        </>
    );
};

export default AddListOrCard;
