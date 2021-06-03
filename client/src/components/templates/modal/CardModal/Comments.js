import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../../../utils/socket';
import { cutMongooseTimestampInDate, getPicturePath, isEmpty } from '../../../../utils/utils';
import CommentBox from '../../board/CommentBox';
import Button from '../../../utils/Button';

const Comments = ({ boardID, listID, cardID, comments }) => {
    const commentRef = useRef();
    const newCommentRef = useRef();
    const [commentsState, setCommentsState] = useState([]);
    const [commentEdited, setCommentEdited] = useState({
        commentID: null,
        isEdit: false,
    });
    const [commentMessageEdited, setCommentMessageEdited] = useState('');
    const { _id: userID, picture } = useSelector((state) => state.userReducer);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('card edit comment', ({ boardID, listID, cardID, commentID, message }) => {
            setCommentsState((oldComments) => {
                return oldComments.map((comment) => {
                    if (comment._id === commentID) {
                        comment.message = message;
                    }
                    return comment;
                });
            });
        });
    }, []);

    useEffect(() => {
        if (isEmpty(comments)) return;
        setCommentsState(comments);
    }, [comments]);

    const handleFormatDate = (createdAt) => {
        const { dayNum, monthLetter, hour } = cutMongooseTimestampInDate(createdAt);
        return `${dayNum} ${monthLetter} at ${hour}`;
    };

    useEffect(() => {
        const currentCardID = cardID;
        socket.on('card comment', ({ boardID, listID, cardID, comments }) => {
            if (cardID === currentCardID) {
                setCommentsState((oldComments) => {
                    return [...oldComments, comments];
                });
            }
        });
        socket.on('card delete comment', ({ boardID, listID, cardID, commentID }) => {
            if (cardID === currentCardID) {
                setCommentsState((oldComments) => {
                    return oldComments.filter((comment) => comment._id !== commentID);
                });
            }
        });
        return () => {
            socket.off('card comment');
            socket.off('card delete comment');
        };
    }, []);

    const handleSendComment = () => {
        if (!message) return;
        socket.emit('card comment', { boardID, listID, cardID, userID, message });
    };

    const handleDeleteComment = (commentID) => {
        socket.emit('card delete comment', { boardID, listID, cardID, commentID });
    };

    const handleEditComment = (commentID) => {
        socket.emit('card edit comment', {
            boardID,
            listID,
            cardID,
            commentID,
            message: commentMessageEdited,
        });
        setCommentEdited({
            commentID: null,
            isEdit: false,
        });
    };

    const handleSetNewMessage = () => {
        setCommentMessageEdited(newCommentRef.current.textContent);
    };

    const handleSetEditComment = async (commentID, message) => {
        await setCommentEdited({
            commentID,
            isEdit: true,
        });
        setCommentMessageEdited(message);
        newCommentRef.current.innerText = message;
        // console.log(commentID);
    };

    return (
        <>
            <div className="cardmodal__content__left__comment">
                <CommentBox
                    content={message}
                    setContent={setMessage}
                    submitFunc={handleSendComment}
                    userPicture={picture}
                />
                <ul className="cardmodal__content__left__comment__list">
                    {commentsState.map(({ user, message, createdAt, _id }, index) => {
                        return (
                            <li
                                key={index}
                                className="cardmodal__content__left__comment__list__item"
                                style={{
                                    marginBottom: index === commentsState.length - 1 ? '' : '16px',
                                }}>
                                <div className="cardmodal__content__left__comment__list__item__head">
                                    <img
                                        src={getPicturePath('user', user.picture)}
                                        alt=""
                                        className="cardmodal__content__left__comment__list__item__head__profil-img"
                                    />
                                    <div className="cardmodal__content__left__comment__list__item__head__infos">
                                        <h4 className="cardmodal__content__left__comment__list__item__head__infos__name">
                                            {user.pseudo}
                                        </h4>
                                        <span className="cardmodal__content__left__comment__list__item__head__infos__date">
                                            {handleFormatDate(createdAt)}
                                        </span>
                                    </div>
                                    {user._id === userID && (
                                        <div className="cardmodal__content__left__comment__list__item__head__btn-wrapper">
                                            <button
                                                className="cardmodal__content__left__comment__list__item__head__btn-wrapper__edit"
                                                onClick={() => handleSetEditComment(_id, message)}>
                                                Edit
                                            </button>
                                            -
                                            <button
                                                className="cardmodal__content__left__comment__list__item__head__btn-wrapper__delete"
                                                onClick={() => handleDeleteComment(_id)}>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {commentEdited.isEdit && commentEdited.commentID === _id ? (
                                    // <CommentBox
                                    //     isNewComment={false}
                                    //     content={commentMessageEdited}
                                    //     setContent={setCommentMessageEdited}
                                    // />
                                    <div className="cardmodal__content__left__comment__list__item__edit-comment-wrapper">
                                        <div
                                            ref={newCommentRef}
                                            contentEditable={true}
                                            onInput={() => handleSetNewMessage()}
                                            className="cardmodal__content__left__comment__list__item__edit-comment-wrapper__input"></div>
                                        <div className="" style={{ display: 'flex' }}>
                                            <Button
                                                className="cardmodal__content__left__comment__list__item__edit-comment-wrapper__btn-save"
                                                onClick={() => handleEditComment(_id)}>
                                                Save
                                            </Button>
                                            <Button
                                                className="cardmodal__content__left__comment__list__item__edit-comment-wrapper__btn-cancel"
                                                onClick={() =>
                                                    setCommentEdited({
                                                        commentID: null,
                                                        isEdit: false,
                                                    })
                                                }>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="cardmodal__content__left__comment__list__item__comment">
                                        {message}
                                    </p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default Comments;
