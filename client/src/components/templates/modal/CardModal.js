import React, { useEffect, useState } from 'react';
import Button from '../../utils/Button';
import Modal from '../../utils/Modal';
import { FaUserCircle } from 'react-icons/fa';
import CategoryTitle from '../../layouts/CategoryTitle';
import { MdGroup, MdLabel, MdImage, MdAdd } from 'react-icons/md';
import axios from '../../../utils/axios';
import { useSelector } from 'react-redux';
import AssignMember from '../dropdown/AssignMember';
import { isEmpty } from '../../../utils/utils';
import UserDisplay from '../../layouts/UserDisplay';
import socket from '../../../utils/socket';
import Description from './CardModal/Description';
import Attachments from './CardModal/Attachments';
import Comments from './CardModal/Comments';
import Loader from '../../utils/Loader';
import Label from '../dropdown/Label';

const CardModal = ({ isOpen, setIsOpen, _id, listID, listName }) => {
    const board = useSelector((state) => state.boardReducer.currentBoard);
    const [card, setCard] = useState([]);
    const [isOpenLabel, setIsOpenLabel] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenAssignMember, setIsOpenAssignMember] = useState(false);

    useEffect(() => {
        axios
            .post(`/board/card/${_id}`, { boardID: board._id, listID })
            .then((res) => {
                setCard(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [board._id, listID, _id]);

    useEffect(() => {
        const currentCardID = _id;
        socket.on('assign member card', ({ assignedMembers, cardID }) => {
            if (currentCardID === cardID) {
                setCard((oldCard) => {
                    return { ...oldCard, members: [...assignedMembers] };
                });
            }
        });
        socket.on('change card description', ({ boardID, listID, cardID, description }) => {
            if (currentCardID === cardID) {
                setCard((oldCard) => {
                    return { ...oldCard, description: description };
                });
            }
        });
        socket.on('change card title', ({ boardID, listID, cardID, cardTitle }) => {
            if (currentCardID === cardID) {
                setCard((oldCard) => {
                    return { ...oldCard, title: cardTitle };
                });
            }
        });
        return () => {
            socket.off('change card description');
        };
    }, [_id]);

    const handleChangeCardTitle = () => {
        const changeCardTitleObject = {
            boardID: board._id,
            listID,
            cardID: _id,
            cardTitle: card.title,
        };
        socket.emit('change card title', changeCardTitleObject);
    };

    return (
        <Modal
            hasCloseButton={true}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            hasOverflowYScroll={true}>
            <div className="cardmodal">
                {isLoading ? (
                    <Loader radius={150} />
                ) : (
                    <>
                        <div className="cardmodal__head">
                            <img className="cardmodal__head__img" src="" alt="card" />
                        </div>
                        <div className="cardmodal__content">
                            <div className="cardmodal__content__left">
                                <div className="cardmodal__content__left__head">
                                    <textarea
                                        value={card.title}
                                        onChange={(e) =>
                                            setCard({ ...card, title: e.target.value })
                                        }
                                        onBlur={() => handleChangeCardTitle()}
                                        className="cardmodal__content__left__head__title"
                                    />
                                    <span className="cardmodal__content__left__head__inlist">
                                        in list{' '}
                                        <span className="cardmodal__content__left__head__inlist__name">
                                            {listName}
                                        </span>
                                    </span>
                                </div>
                                <Description listID={listID} board={board} card={card} />
                                <Attachments
                                    attachments={card.attachments}
                                    boardID={board._id}
                                    listID={listID}
                                    cardID={_id}
                                />
                                <Comments
                                    comments={card.comments}
                                    boardID={board._id}
                                    listID={listID}
                                    cardID={_id}
                                />
                            </div>
                            <div className="cardmodal__content__right">
                                <CategoryTitle icon={<FaUserCircle />} title="Actions" />

                                <div className="" style={{ position: 'relative' }}>
                                    <Button
                                        className="cardmodal__content__right__btn"
                                        onClick={() => setIsOpenLabel(true)}>
                                        <MdLabel className="cardmodal__content__right__btn__icon" />
                                        <span className="cardmodal__content__right__btn__label">
                                            Labels
                                        </span>
                                    </Button>
                                    <Label
                                        labels={card.labels}
                                        boardID={board._id}
                                        listID={listID}
                                        cardID={_id}
                                        isOpen={isOpenLabel}
                                        setIsOpen={setIsOpenLabel}
                                    />
                                </div>

                                <Button className="cardmodal__content__right__btn">
                                    <MdImage className="cardmodal__content__right__btn__icon" />
                                    <span className="cardmodal__content__right__btn__label">
                                        Cover
                                    </span>
                                </Button>
                                <div className="cardmodal__content__right__members">
                                    <CategoryTitle icon={<MdGroup />} title="Members" />
                                    <ul className="cardmodal__content__right__members__list">
                                        {!isEmpty(card) &&
                                            card.members.map((member) => {
                                                return (
                                                    <UserDisplay
                                                        key={member._id}
                                                        pseudo={member.pseudo}
                                                        picture={member.picture}
                                                    />
                                                );
                                            })}
                                    </ul>
                                    <Button
                                        className="cardmodal__content__right__members__btn-add"
                                        onClick={() => setIsOpenAssignMember(true)}>
                                        <span>Assign a member</span>{' '}
                                        <MdAdd className="cardmodal__content__right__members__btn-add__icon" />
                                    </Button>
                                    <AssignMember
                                        cardMembers={card.members}
                                        cardID={_id}
                                        listID={listID}
                                        isOpen={isOpenAssignMember}
                                        setIsOpen={setIsOpenAssignMember}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default CardModal;
