import React from 'react';
import DropDown from '../../utils/Dropdown';
import { MdPublic } from 'react-icons/md';
import { IoMdLock } from 'react-icons/io';
import { useSelector } from 'react-redux';
import socket from '../../../utils/socket';

const PrivateOrPublic = ({ isOpen, setIsOpen }) => {
    const currentBoard = useSelector((state) => state.boardReducer.currentBoard);

    const handleChangeState = (state) => {
        if (currentBoard.isPrivate === state) return;
        const boardID = currentBoard._id;
        setIsOpen(false);
        socket.emit('change state', { boardID, state });
    };

    return (
        <DropDown
            contentClass="privateorpublic"
            left="-6px"
            top="45px"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Visibility"
            description="Choose who can see to this board.">
            <button
                className={`privateorpublic__btn ${
                    !currentBoard.isPrivate ? 'privateorpublic-active' : ''
                }`}
                style={{ marginBottom: '8px' }}
                onClick={() => handleChangeState(false)}>
                <div className="privateorpublic__btn__top">
                    <MdPublic className="privateorpublic__btn__top__icon" />
                    <span>Public</span>
                </div>
                <p className="privateorpublic__btn__desc">Anyone on the internet can see this.</p>
            </button>
            <button
                className={`privateorpublic__btn ${
                    currentBoard.isPrivate ? 'privateorpublic-active' : ''
                }`}
                onClick={() => handleChangeState(true)}>
                <div className="privateorpublic__btn__top">
                    <IoMdLock className="privateorpublic__btn__top__icon" />
                    <span>Private</span>
                </div>
                <p className="privateorpublic__btn__desc">Only board members can see this</p>
            </button>
        </DropDown>
    );
};

export default PrivateOrPublic;
