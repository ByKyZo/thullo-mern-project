import React, { useState } from 'react';
import PageTemplate from '../components/templates/PageTemplate';
import { Link } from 'react-router-dom';
import Button from '../components/utils/Button';
import { RiAddFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { getPicturePath } from '../utils/utils';
import ModalCreateBoard from '../components/templates/modal/CreateBoard.jsx';
import { v4 as uuid } from 'uuid';
// REDIRIGER VERS LOGIN SI NON CONNECTE
const Home = () => {
    const boards = useSelector((state) => state.boardReducer.boards);
    const [isOpenCreateBoard, setIsOpenCreateBoard] = useState(false);

    return (
        <>
            <ModalCreateBoard isOpen={isOpenCreateBoard} setIsOpen={setIsOpenCreateBoard} />

            <PageTemplate pageTitle="Allboards">
                <div className="allboards">
                    <div className="allboards__top">
                        <h1 className="allboards__top__title">All Boards</h1>
                        <Button
                            className="allboards__top__btn"
                            onClick={() => setIsOpenCreateBoard(true)}>
                            <RiAddFill className="allboards__top__btn__icon" />
                            <span className="allboards__top__btn__label">Add</span>
                        </Button>
                    </div>

                    <div className="allboards__container">
                        {/* PLUS PARAMS ID PLUS TARD */}
                        {/* FAIRE UN COMPOSANT POUR LES BOARDS ITEMS ? */}
                        {boards.map(({ _id, name, picture, members, isPrivate, owner }) => {
                            return (
                                <Link
                                    key={uuid()}
                                    to={`/board/${_id}`}
                                    className="allboards__container__items">
                                    <img
                                        className="allboards__container__items__img"
                                        src={getPicturePath('board', picture)}
                                        alt={`board ${name}`}
                                    />
                                    <span className="allboards__container__items__title">
                                        {name}
                                    </span>
                                    <ul className="allboards__container__items__members">
                                        {members.map(({ _id, pseudo, picture }) => {
                                            return (
                                                <li
                                                    key={_id}
                                                    className="allboards__container__items__members__profil">
                                                    <img
                                                        src={getPicturePath('user', picture)}
                                                        alt={`${pseudo} profil`}></img>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </PageTemplate>
        </>
    );
};

export default Home;
