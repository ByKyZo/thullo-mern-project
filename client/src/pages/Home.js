import React, { useMemo, useState } from 'react';
import PageTemplate from '../components/templates/PageTemplate';
import Button from '../components/utils/Button';
import { RiAddFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import ModalCreateBoard from '../components/templates/modal/CreateBoard.jsx';
import BoardItem from '../components/templates/board/BoardItem';
// REDIRIGER VERS LOGIN SI NON CONNECTE
const Home = () => {
    const boards = useSelector((state) => state.boardReducer.boards);
    const boardsMemo = useMemo(() => boards.map((board) => board), [boards]);
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
                        {boardsMemo.map((board) => {
                            return <BoardItem key={board._id} {...board} />;
                        })}
                    </div>
                </div>
            </PageTemplate>
        </>
    );
};

export default Home;
