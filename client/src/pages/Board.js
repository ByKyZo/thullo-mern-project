import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageTemplate from '../components/templates/PageTemplate';
import { connect, useDispatch, useSelector } from 'react-redux';
import { cleanCurrentBoard, getBoard } from '../redux/actions/board.action';
import Button from '../components/utils/Button';
import { HiDotsHorizontal } from 'react-icons/hi';
import { MdLock, MdAdd } from 'react-icons/md';
import { getPicturePath, isEmpty } from '../utils/utils';
import InviteMember from '../components/templates/dropdown/InviteMember';
import BoardError from './BoardError';
import PrivateOrPublic from '../components/templates/dropdown/PrivateOrPublic';
import BoardMenu from '../components/templates/dropdown/BoardMenu';
import ListManager from '../components/templates/board/ListManager';

const Board = (props) => {
    const { id } = useParams();
    const board = useSelector((state) => state.boardReducer.currentBoard);
    const dispatch = useDispatch();
    const [isOpenInviteMember, setIsOpenInviteMember] = useState(false);
    const [isOpenPrivateOrPublic, setIsOpenPrivateOrPublic] = useState(false);
    const [isOpenBoardMenu, setIsOpenBoardMenu] = useState(false);

    useEffect(() => {
        dispatch(getBoard(id));
        return () => {
            dispatch(cleanCurrentBoard());
            setIsOpenInviteMember(false);
            setIsOpenPrivateOrPublic(false);
            setIsOpenBoardMenu(false);
        };
    }, [dispatch, id]);

    return (
        // METTRE LE NOM DU BOARD DYNAMIQUEMENT DANS LE TITRE
        <>
            {board === 'BOARD_ERROR' || isEmpty(board) ? (
                <BoardError />
            ) : (
                <PageTemplate
                    boardName={board.name}
                    pageTitle={`Board - ${board.name}`}
                    isHeaderBoard={true}>
                    <div className="board">
                        <BoardMenu isOpen={isOpenBoardMenu} setIsOpen={setIsOpenBoardMenu} />

                        {board.NOT_MEMBER ? (
                            <p className="board__not-member">
                                This board is public , you can't interact with him if you are not
                                member
                            </p>
                        ) : (
                            <div className="board__top">
                                <div className="board__top__left">
                                    <span>
                                        <Button
                                            className="board__top__left__btn-state"
                                            onClick={() => setIsOpenPrivateOrPublic(true)}>
                                            <MdLock className="board__top__left__btn-state__icon" />
                                            {board.isPrivate ? 'Private' : 'Public'}
                                        </Button>
                                        <PrivateOrPublic
                                            isOpen={isOpenPrivateOrPublic}
                                            setIsOpen={setIsOpenPrivateOrPublic}
                                        />
                                    </span>
                                    <div className="board__top__left__members">
                                        <ul className="board__top__left__members__list">
                                            {!isEmpty(board.members) &&
                                                board.members.map(({ picture, _id, pseudo }) => {
                                                    return (
                                                        <li
                                                            key={_id}
                                                            className="board__top__left__members__list__item">
                                                            <img
                                                                src={getPicturePath(
                                                                    'user',
                                                                    picture
                                                                )}
                                                                alt={`${pseudo} profil`}
                                                                style={{ width: '100%' }}
                                                            />
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                        <div className="board__top__left__members__adduser-wrapper">
                                            <Button
                                                className="board__top__left__members__btn-adduser"
                                                onClick={() => setIsOpenInviteMember(true)}>
                                                <MdAdd />
                                            </Button>
                                            <InviteMember
                                                isOpen={isOpenInviteMember}
                                                setIsOpen={setIsOpenInviteMember}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="board__top__right">
                                    <Button
                                        className="board__top__right__btn-menu"
                                        onClick={() => setIsOpenBoardMenu(true)}>
                                        <HiDotsHorizontal className="board__top__right__btn-menu__icon" />
                                        <span className="board__top__right__btn-menu__label">
                                            Show Menu
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        )}
                        {/* ALL LIST */}
                        <ListManager />
                    </div>
                </PageTemplate>
            )}
        </>
    );
};

export default connect()(Board);
