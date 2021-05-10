import React from 'react';
import { BsPaperclip } from 'react-icons/bs';
import { MdComment } from 'react-icons/md';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdAdd } from 'react-icons/md';
import Button from '../../utils/Button';
import AddList from './AddList';

const TableItem = (props) => {
    return (
        <div className="board__content__table">
            <div className="board__content__table__top">
                <span className="board__content__table__top__title">Table Name</span>
                <button className="board__content__table__top__btn-menu">
                    <HiDotsHorizontal />
                </button>
            </div>
            <ul className="board__content__table__content">
                <li className="board__content__table__content__item">
                    <div className="board__content__table__content__item__image"></div>
                    <span className="board__content__table__content__item__title">
                        Github jobs challenge
                    </span>
                    <ul className="board__content__table__content__item__category">
                        <li className="board__content__table__content__item__category__item">
                            Design
                        </li>
                        <li className="board__content__table__content__item__category__item">
                            Concept
                        </li>
                    </ul>
                    <div className="board__content__table__content__item__bottom">
                        <ul className="board__content__table__content__item__bottom__members">
                            <li className="board__content__table__content__item__bottom__members__item"></li>
                            <li>
                                <Button className="board__content__table__content__item__bottom__members__btn-addmember">
                                    <MdAdd className="board__content__table__content__item__bottom__members__btn-addmember__icon" />
                                </Button>
                            </li>
                        </ul>

                        <div className="board__content__table__content__item__bottom__utils">
                            <button className="board__content__table__content__item__bottom__utils__btn">
                                <MdComment />
                                <span className="board__content__table__content__item__bottom__utils__btn__number">
                                    1
                                </span>
                            </button>
                            <button className="board__content__table__content__item__bottom__utils__btn">
                                <BsPaperclip />
                                <span className="board__content__table__content__item__bottom__utils__btn__number">
                                    1
                                </span>
                            </button>
                        </div>
                    </div>
                </li>
                <li className="board__content__table__content__item"></li>

                <li className="board__content__table__content__item"></li>
                <AddList />
            </ul>
        </div>
    );
};

export default TableItem;
