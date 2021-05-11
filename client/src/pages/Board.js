import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from '../components/templates/PageTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { cleanCurrentBoard, getBoard } from '../redux/actions/board.action';
import Button from '../components/utils/Button';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdLock, MdAdd } from 'react-icons/md';
import TableItem from '../components/templates/board/TableItem';
import AddList from '../components/templates/board/AddList';
import { getPicturePath, isEmpty } from '../utils/utils';
import InviteMember from '../components/templates/dropdown/InviteMember';

const Board = (props) => {
    const { id } = useParams();
    const board = useSelector((state) => state.boardReducer.currentBoard);
    const dispatch = useDispatch();
    const [isOpenInviteMember, setIsOpenInviteMember] = useState(false);

    useEffect(() => {
        dispatch(getBoard(id));

        return () => dispatch(cleanCurrentBoard());
    }, [dispatch, id]);

    // CUSTOM LA SCROLLBAR

    // const returnTestTable = () => {
    //     const tables = [];
    //     for (let i = 0; i <= 8; i++) {
    //         i === 8 ? tables.push(<TableItem />) : tables.push(<TableItem />);
    //     }
    //     return tables;
    //     // padding-right: 25px;
    // };

    return (
        // METTRE LE NOM DU BOARD DYNAMIQUEMENT DANS LE TITRE
        <>
            <PageTemplate
                boardName={board.name}
                pageTitle={`Board - ${board.name}`}
                isHeaderBoard={true}>
                <div className="board">
                    <div className="board__top">
                        <div className="board__top__left">
                            <Button className="board__top__left__btn-state">
                                <MdLock className="board__top__left__btn-state__icon" />
                                {board.isPrivate ? 'Private' : 'Public'}
                            </Button>
                            <ul className="board__top__left__members">
                                {!isEmpty(board.members) &&
                                    board.members.map(({ picture, _id, pseudo }) => {
                                        return (
                                            <li
                                                key={_id}
                                                className="board__top__left__members__item">
                                                <img
                                                    src={getPicturePath('user', picture)}
                                                    alt={`${pseudo} profil`}
                                                    style={{ width: '100%' }}
                                                />
                                            </li>
                                        );
                                    })}
                                <li className="board__top__left__members__adduser-wrapper">
                                    <Button
                                        className="board__top__left__members__btn-adduser"
                                        onClick={() => setIsOpenInviteMember(true)}>
                                        <MdAdd />
                                    </Button>
                                    <InviteMember
                                        isOpen={isOpenInviteMember}
                                        setIsOpen={setIsOpenInviteMember}
                                    />
                                </li>
                            </ul>
                        </div>
                        <div className="board__top__right">
                            <Button className="board__top__right__btn-menu">
                                <HiDotsHorizontal className="board__top__right__btn-menu__icon" />
                                <span className="board__top__right__btn-menu__label">
                                    Show Menu
                                </span>
                            </Button>
                        </div>
                    </div>
                    <div className="board__content">
                        <TableItem />
                        <TableItem />
                        <AddList isNewTable={true} />
                    </div>
                </div>
            </PageTemplate>
        </>
    );
};

export default Board;
