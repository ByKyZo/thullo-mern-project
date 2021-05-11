import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinBoard } from '../redux/actions/board.action';
import { addNotification } from '../redux/actions/user.action';
import socket from '../utils/socket';

const SocketManager = (props) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.userReducer);

    useEffect(() => {
        socket.on('send invitation', (invitations) => {
            dispatch(addNotification(invitations));
        });
        socket.on('join board', ({ user, board }) => {
            dispatch(joinBoard(currentUser, user, board));
        });
    }, [dispatch]);

    return <></>;
};

export default SocketManager;
