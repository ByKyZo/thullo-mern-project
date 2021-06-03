import React from 'react';
import { BsPaperclip } from 'react-icons/bs';
import { MdComment } from 'react-icons/md';
import { MdAdd } from 'react-icons/md';
import Button from '../../utils/Button';
import { CARD_MODAL } from '../modal/ModalManager';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/actions/modal.action';
import { getPicturePath } from '../../../utils/utils';
import CardLabel from './CardLabel';

const CardItem = ({ _id, title, picture, labels, members, attachments, listID, listName }) => {
    const dispatch = useDispatch();

    return (
        <>
            <li
                className="card"
                onClick={(e) => {
                    dispatch(openModal(CARD_MODAL, { _id, listID, listName }));
                }}>
                {picture && <div className="card__image"></div>}
                <span className="card__title">{title}</span>
                <div className="card__category">
                    {labels.map((label) => {
                        return (
                            <CardLabel
                                key={label._id}
                                style={{ marginBottom: '8px' }}
                                name={label.name}
                                color={label.color}
                            />
                        );
                    })}
                </div>
                <div className="card__bottom">
                    <ul className="card__bottom__members">
                        {members.map((member, index) => {
                            return (
                                <li key={index} className="card__bottom__members__item">
                                    <img
                                        className="card__bottom__members__item__img"
                                        src={getPicturePath('user', member.picture)}
                                        alt=""
                                    />
                                </li>
                            );
                        })}
                        <li>
                            <Button
                                className="card__bottom__members__btn-addmember"
                                onClick={(e) => e.stopPropagation()}>
                                <MdAdd className="card__bottom__members__btn-addmember__icon" />
                            </Button>
                        </li>
                    </ul>

                    <div className="card__bottom__utils">
                        <button className="card__bottom__utils__btn">
                            <MdComment />
                            <span className="card__bottom__utils__btn__number">1</span>
                        </button>
                        <button className="card__bottom__utils__btn">
                            <BsPaperclip />
                            <span className="card__bottom__utils__btn__number">1</span>
                        </button>
                    </div>
                </div>
            </li>
        </>
    );
};

export default CardItem;
