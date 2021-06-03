import React, { useState } from 'react';
import CategoryTitle from '../../../layouts/CategoryTitle';
import { MdDescription, MdEdit } from 'react-icons/md';
import Button from '../../../utils/Button';
import ContentEditable from '../../ContentEditable';
import socket from '../../../../utils/socket';

const Description = ({ card, listID, board }) => {
    const [isOpenEditDesc, setIsOpenEditDesc] = useState(false);

    const handleChangeCardDescription = (newDesc) => {
        socket.emit('change card description', {
            boardID: board._id,
            listID,
            cardID: card._id,
            description: newDesc,
        });
        setIsOpenEditDesc(false);
    };

    return (
        <div className="cardmodal__content__left__description">
            <div className="cardmodal__content__left__description__head">
                <CategoryTitle
                    icon={<MdDescription />}
                    title="Description"
                    withMarginBottom={false}
                />
                <Button
                    className="cardmodal__content__left__description__head__btn-edit"
                    onClick={() => setIsOpenEditDesc(true)}>
                    <MdEdit className="cardmodal__content__left__description__head__btn-edit__icon" />
                    <span className="cardmodal__content__left__description__head__btn-edit__label">
                        Edit
                    </span>
                </Button>
            </div>
            {isOpenEditDesc ? (
                <ContentEditable
                    content={card.description}
                    submitFunc={handleChangeCardDescription}
                    setIsOpen={setIsOpenEditDesc}
                />
            ) : (
                <p
                    dangerouslySetInnerHTML={{ __html: card.description }}
                    className="cardmodal__content__left__description__content"
                />
            )}
        </div>
    );
};

export default Description;
