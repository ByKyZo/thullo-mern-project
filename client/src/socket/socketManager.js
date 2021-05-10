import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/actions/user.action';
import socket from '../utils/socket';

const SocketManager = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('send invitation', (invitations) => {
            dispatch(addNotification(invitations));
        });
    }, [dispatch]);

    return <></>;
};

export default SocketManager;
