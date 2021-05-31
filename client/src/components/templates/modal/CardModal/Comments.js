import React, { useRef, useState } from 'react';

const Comments = (props) => {
    const commentRef = useRef();
    const [isDisabledPlaceholder, setIsDisabledPlaceholder] = useState(false);
    const [comment, setComment] = useState('');

    const handleSetComment = () => {
        setComment(commentRef.current.textContent);
        if (!comment) setIsDisabledPlaceholder(true);
    };

    return (
        <div className="cardmodal__content__left__comment">
            <div className="cardmodal__content__left__comment__input-wrapper">
                <img
                    src=""
                    alt=""
                    className="cardmodal__content__left__comment__input-wrapper__profil"
                />
                {!isDisabledPlaceholder && (
                    <span className="cardmodal__content__left__comment__input-wrapper__placeholder">
                        Write a comment...
                    </span>
                )}
                <div
                    ref={commentRef}
                    contentEditable={true}
                    onFocus={() => setIsDisabledPlaceholder(true)}
                    onBlur={() => !comment && setIsDisabledPlaceholder(false)}
                    onInput={() => handleSetComment()}
                    className="cardmodal__content__left__comment__input-wrapper__input"></div>
                <button className="cardmodal__content__left__comment__input-wrapper__btn-send">
                    Comment
                </button>
            </div>
            <ul className="cardmodal__content__left__comment__list">
                <li className="cardmodal__content__left__comment__list__item">
                    <div className="cardmodal__content__left__comment__list__item__head">
                        <img
                            src=""
                            alt=""
                            className="cardmodal__content__left__comment__list__item__head__profil-img"
                        />
                        <div className="cardmodal__content__left__comment__list__item__head__infos">
                            <h4 className="cardmodal__content__left__comment__list__item__head__infos__name">
                                Mikael Stanley
                            </h4>
                            <span className="cardmodal__content__left__comment__list__item__head__infos__date">
                                24 August at 20:43
                            </span>
                        </div>
                        <div className="cardmodal__content__left__comment__list__item__head__btn-wrapper">
                            <button className="cardmodal__content__left__comment__list__item__head__btn-wrapper__edit">
                                Edit
                            </button>
                            -
                            <button className="cardmodal__content__left__comment__list__item__head__btn-wrapper__delete">
                                Delete
                            </button>
                        </div>
                    </div>
                    <p className="cardmodal__content__left__comment__list__item__comment">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure veniam
                        molestiae dolores ex qui nobis eveniet debitis expedita.
                    </p>
                </li>
            </ul>
        </div>
    );
};

export default Comments;
