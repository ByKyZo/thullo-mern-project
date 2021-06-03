import React, { useEffect, useRef, useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { closeOnClickOutside, isEmpty } from '../../../utils/utils';
import AddListOrCard from './AddList';
import CardItem from './CardItem';
import DropDown from '../../utils/Dropdown';
import Modal from '../../utils/Modal';
import { useSelector } from 'react-redux';
import socket from '../../../utils/socket';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import Placeholder from './Placeholder';

const ListItem = React.forwardRef(({ _id, name, cards, placeHolderProps }, ref) => {
    const droppableListDomID = `list-content-${_id}`;
    const inputRenameRef = useRef();
    const renameFormRef = useRef();
    const [isOpenInputAddCard, setIsOpenInputAddCard] = useState(false);
    const boardID = useSelector((state) => state.boardReducer.currentBoard._id);
    const listsReducer = useSelector((state) => state.boardReducer.currentBoard.lists);
    const [rename, setRename] = useState();
    const [isOpenListMenu, setIsOpenListMenu] = useState(false);
    const [isOpenConfirmDeleteList, setIsOpenConfirmDeleteList] = useState(false);
    const [isOpenListRename, setIsOpenListRename] = useState(false);
    const [cardsState, setCardsState] = useState([]);

    useEffect(() => {
        setCardsState(
            cards.map((card, index) => {
                if (isEmpty(card)) return <span></span>;
                return (
                    <Draggable key={card._id} draggableId={`card-${card._id}`} index={index}>
                        {(provided, snapshot) => {
                            return (
                                <div
                                    className="card-wrapper"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <CardItem
                                        key={card._id}
                                        listName={name}
                                        listID={_id}
                                        {...card}
                                    />
                                </div>
                            );
                        }}
                    </Draggable>
                );
            })
        );
    }, [cards, listsReducer, _id, name]);

    const handleAddCartScrollReset = () => {
        const listEl = document.querySelector(`#${droppableListDomID}`);
        listEl.scrollTop = listEl.scrollHeight;
    };

    const handleOpenInputAddCard = async () => {
        await setIsOpenInputAddCard(true);
        handleAddCartScrollReset();
    };

    const handleOpenListRename = async () => {
        setIsOpenListMenu(false);
        await setIsOpenListRename(true);
        inputRenameRef.current.focus();
    };

    const handleListRename = () => {
        socket.emit('rename list', { rename, listID: _id, boardID });
        setIsOpenListRename(false);
    };

    const handleDeleteList = () => {
        socket.emit('delete list', { listID: _id, boardID });
        setIsOpenConfirmDeleteList(false);
    };

    useEffect(() => {
        closeOnClickOutside(renameFormRef, setIsOpenListRename);
    }, []);

    return (
        <>
            <Modal
                isOpen={isOpenConfirmDeleteList}
                setIsOpen={setIsOpenConfirmDeleteList}
                hasChoiceButton={true}
                confirmMessage="Are your sure delete this list ?"
                confirmFunction={() => handleDeleteList()}
            />

            <div ref={ref} className="list">
                <div className="list__top">
                    {isOpenListRename ? (
                        <form
                            className="list__top__rename"
                            onSubmit={() => handleListRename()}
                            ref={renameFormRef}>
                            <input
                                ref={inputRenameRef}
                                className="list__top__rename__input"
                                type="text"
                                defaultValue={name}
                                onChange={(e) => setRename(e.target.value)}
                            />
                            <div className="list__top__rename__btn-wrapper">
                                <button
                                    type="submit"
                                    className="list__top__rename__btn-wrapper__check list__top__rename__btn-wrapper__btn">
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsOpenListRename(false)}
                                    type="button"
                                    className="list__top__rename__btn-wrapper__cancel list__top__rename__btn-wrapper__btn">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <span className="list__top__title">{name}</span>
                    )}
                    {!isOpenListRename && (
                        <button
                            className="list__top__btn-menu"
                            onClick={() => setIsOpenListMenu(true)}>
                            <HiDotsHorizontal />
                        </button>
                    )}
                    <DropDown
                        top="28px"
                        right="-148px"
                        isOpen={isOpenListMenu}
                        setIsOpen={setIsOpenListMenu}>
                        <ul className="listmenu">
                            <li className="listmenu__item">
                                <button
                                    className="listmenu__item__btn"
                                    onClick={() => handleOpenListRename()}>
                                    Rename
                                </button>
                            </li>
                            <li className="listmenu__item listmenu__divider"></li>
                            <li className="listmenu__item">
                                <button
                                    className="listmenu__item__btn"
                                    onClick={() => setIsOpenConfirmDeleteList(true)}>
                                    Delete this list
                                </button>
                            </li>
                        </ul>
                    </DropDown>
                </div>
                <Droppable droppableId={`card-droppable-${_id}`} type="CARD">
                    {(provided, snapshot) => {
                        return (
                            <ul
                                id={droppableListDomID}
                                className="list__content"
                                ref={provided.innerRef}
                                {...provided.droppableProps}>
                                {cardsState}
                                {provided.placeholder}
                                {placeHolderProps.type === 'CARD' && snapshot.isDraggingOver && (
                                    <Placeholder {...placeHolderProps} />
                                )}
                                {isOpenInputAddCard && (
                                    <AddListOrCard
                                        onClick={() => handleOpenInputAddCard()}
                                        isOpen={isOpenInputAddCard}
                                        setIsOpen={setIsOpenInputAddCard}
                                        listID={_id}
                                        isFirstCard={isEmpty(cards) && true}
                                    />
                                )}
                            </ul>
                        );
                    }}
                </Droppable>
                {!isOpenInputAddCard && (
                    <AddListOrCard
                        onClick={() => handleOpenInputAddCard()}
                        isOpen={isOpenInputAddCard}
                        setIsOpen={setIsOpenInputAddCard}
                        listID={_id}
                        scrollBottomReset={handleAddCartScrollReset}
                        isFirstCard={isEmpty(cards) && true}
                    />
                )}
            </div>
        </>
    );
});

export default ListItem;
