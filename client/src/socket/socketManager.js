import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    addCard,
    addCardLabel,
    addList,
    assignMemberToCard,
    banMember,
    changeCardDescription,
    changeCardTitle,
    changeDescription,
    changeState,
    deleteBoard,
    deleteCardLabel,
    deleteList,
    joinBoard,
    leaveBoard,
    renameList,
    reorderList,
} from '../redux/actions/board.action';
import { addNotification } from '../redux/actions/user.action';
import socket from '../utils/socket';

const SocketManager = (props) => {
    const dispatch = useDispatch();

    const dispatchCallback = useCallback(
        (func) => {
            dispatch(func);
        },
        [dispatch]
    );

    useEffect(() => {
        socket.on('send invitation', (invitations) => {
            dispatchCallback(addNotification(invitations));
        });
        socket.on('join board', ({ user, board }) => {
            dispatchCallback(joinBoard(user, board));
        });
        socket.on('change state', ({ boardID, state }) => {
            dispatchCallback(changeState(boardID, state));
        });
        socket.on('ban member', ({ boardID, memberBannedID }) => {
            dispatchCallback(banMember(boardID, memberBannedID));
        });
        socket.on('change description', ({ description, boardID }) => {
            console.log('change desc scktio');
            dispatchCallback(changeDescription(description, boardID));
        });
        socket.on('add list', ({ listCreated, boardID, userID }) => {
            console.log('add list scktio');
            dispatchCallback(addList(listCreated, boardID, userID));
        });
        socket.on('add card', ({ cardCreated, listID, boardID, userID }) => {
            console.log('add card scktio');
            dispatchCallback(addCard(cardCreated, listID, boardID));
        });
        socket.on('rename list', ({ rename, listID, boardID }) => {
            console.log('rename list scktio');
            dispatchCallback(renameList(rename, listID, boardID));
        });
        socket.on('delete list', ({ listID, boardID }) => {
            console.log('delete list scktio');
            dispatchCallback(deleteList(listID, boardID));
        });
        socket.on('reorder list', ({ listsReorder, boardID, userID }) => {
            console.log('reorder list scktio');
            dispatchCallback(reorderList(listsReorder, boardID, userID));
        });
        socket.on('assign member card', ({ assignedMembers, boardID, listID, cardID }) => {
            dispatchCallback(assignMemberToCard(assignedMembers, boardID, listID, cardID));
        });
        socket.on('change card title', ({ boardID, listID, cardID, cardTitle }) => {
            dispatchCallback(changeCardTitle(boardID, listID, cardID, cardTitle));
        });
        socket.on('change card description', ({ boardID, listID, cardID, description }) => {
            dispatchCallback(changeCardDescription(boardID, listID, cardID, description));
        });
        socket.on('card add label', ({ boardID, listID, cardID, label }) => {
            dispatchCallback(addCardLabel(boardID, listID, cardID, label));
        });
        socket.on('card delete label', ({ boardID, listID, cardID, labelID }) => {
            dispatchCallback(deleteCardLabel(boardID, listID, cardID, labelID));
        });
        socket.on('leave board', ({ userID, boardID }) => {
            console.log('leave board scktio');
            dispatchCallback(leaveBoard(userID, boardID));
        });
        socket.on('delete board', (boardID) => {
            dispatchCallback(deleteBoard(boardID));
        });
    }, [dispatchCallback]);

    return <></>;
};

export default SocketManager;
