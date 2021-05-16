import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    banMember,
    changeDescription,
    changeState,
    joinBoard,
} from '../redux/actions/board.action';
import { addNotification } from '../redux/actions/user.action';
import socket from '../utils/socket';

const SocketManager = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('send invitation', (invitations) => {
            dispatch(addNotification(invitations));
        });
        socket.on('join board', ({ user, board }) => {
            dispatch(joinBoard(user, board));
        });
        socket.on('change state', ({ boardID, state }) => {
            dispatch(changeState(boardID, state));
        });
        socket.on('ban member', ({ boardID, memberBannedID }) => {
            dispatch(banMember(boardID, memberBannedID));
        });
        socket.on('change description', ({ description, boardID }) => {
            console.log('change desc');
            dispatch(changeDescription(description, boardID));
        });
    }, []);

    return <></>;
};

export default SocketManager;
