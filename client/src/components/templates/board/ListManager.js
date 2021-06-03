import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDraggedDom, isEmpty, reorderArray } from '../../../utils/utils';
import ListItem from './ListItem';
import AddListOrCard from './AddList';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { reorderList } from '../../../redux/actions/board.action';
import socket from '../../../utils/socket';
import Placeholder from './Placeholder';

const ListManager = (props) => {
    const lists = useSelector((state) => state.boardReducer.currentBoard.lists);
    const cards = useSelector((state) => state.boardReducer.currentBoard.cards);
    const boardID = useSelector((state) => state.boardReducer.currentBoard._id);
    const userID = useSelector((state) => state.userReducer._id);
    const [listsState, setListsState] = useState([]);
    const [placeHolderProps, setPlaceHolderProps] = useState({
        destinationIndex: null,
        draggableID: '',
        currentListOverID: '',
        type: '',
    });
    const [isDragScroll, setIsDragScroll] = useState(false);
    const dispatch = useDispatch();
    const handleClearDraggedAnimation = () => {
        if (!placeHolderProps.draggableID) return;

        const draggedEl = getDraggedDom(placeHolderProps.draggableID).children[0];
        draggedEl.classList.remove('list-dragged');
        setPlaceHolderProps({});
    };

    const handleClearDraggedAnimationCallback = useCallback(
        () => handleClearDraggedAnimation(),
        [handleClearDraggedAnimation]
    );

    useEffect(() => {
        if (isEmpty(lists)) return console.log('LIST NULL');
        setListsState(
            lists.map((list, index) => {
                return (
                    <Draggable key={list._id} draggableId={`list-${list._id}`} index={index}>
                        {(provided, snapshot) => {
                            return (
                                <div
                                    className="list-wrapper"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}>
                                    <ListItem {...list} placeHolderProps={placeHolderProps} />
                                </div>
                            );
                        }}
                    </Draggable>
                );
            })
        );
    }, [lists, cards, placeHolderProps]);

    useEffect(() => {
        document.addEventListener('mouseup', handleClearDraggedAnimationCallback);
        return () => document.removeEventListener('mouseup', handleClearDraggedAnimationCallback);
    }, [placeHolderProps, handleClearDraggedAnimationCallback]);

    const handleDragScroll = (e) => {
        if (!isDragScroll) return;
        const el = e.target;
        const addScrollValue = 1;
        if (Math.sign(e.movementX) === -1) {
            el.scrollLeft += addScrollValue * Math.abs(e.movementX);
        } else if (Math.sign(e.movementX) === 1) {
            el.scrollLeft -= addScrollValue * e.movementX;
        }
    };

    useEffect(() => {
        document.addEventListener('mouseup', (e) => {
            setIsDragScroll(false);
        });
    }, []);

    const getListIDByDraggableID = (draggabID) => {
        return draggabID.substring(15);
    };

    const handleAddListScrollReset = () => {
        const boardEl = document.querySelector('#board');
        boardEl.scrollLeft = boardEl.scrollWidth;
    };

    const handleDragStart = (dragprops) => {
        const draggedEl = getDraggedDom(dragprops.draggableId).children[0];
        draggedEl.classList.add('list-dragged');
        setPlaceHolderProps({});
        setPlaceHolderProps({
            destinationIndex: dragprops.source.index,
            draggableID: dragprops.draggableId,
            type: dragprops.type,
        });
    };

    const handleDragUpdate = (dragprops) => {
        if (!dragprops.destination) return;
        setPlaceHolderProps({});
        setPlaceHolderProps({
            destinationIndex: dragprops.destination.index,
            draggableID: dragprops.draggableId,
            currentListOverID: dragprops.destination.droppableId,
            type: dragprops.type,
        });
    };

    const reorderCardFunc = (
        currentListID,
        destinationListID,
        currentCardIndex,
        destinationCardIndex,
        lists
    ) => {
        const newLists = [...lists];
        const currentListIndex = newLists.findIndex((list) => list._id === currentListID);
        const destinationListIndex = newLists.findIndex((list) => list._id === destinationListID);
        if (currentListIndex === -1 || destinationListIndex === -1) return newLists;
        const cardDragged = newLists[currentListIndex].cards[currentCardIndex];
        newLists[currentListIndex].cards.splice(currentCardIndex, 1);
        newLists[destinationListIndex].cards.splice(destinationCardIndex, 0, cardDragged);
        return newLists;
    };

    const handleDragEnd = (dragprops) => {
        handleClearDraggedAnimationCallback();
        if (!dragprops.destination) return;
        const currentIndex = dragprops.source.index;
        const destinationIndex = dragprops.destination.index;
        if (dragprops.type === 'LIST') {
            const listsReorder = reorderArray(currentIndex, destinationIndex, lists);
            dispatch(reorderList(listsReorder, boardID));
            socket.emit('reorder list', { listsReorder, boardID, userID });
        } else if (dragprops.type === 'CARD') {
            const currentListID = getListIDByDraggableID(dragprops.source.droppableId);
            const destinationListID = getListIDByDraggableID(dragprops.destination.droppableId);
            const currentCardIndex = dragprops.source.index;
            const destinationCardIndex = dragprops.destination.index;
            const listsReorder = reorderCardFunc(
                currentListID,
                destinationListID,
                currentCardIndex,
                destinationCardIndex,
                lists
            );
            dispatch(reorderList(listsReorder, boardID));
            socket.emit('reorder list', { listsReorder, boardID, userID });
        }
    };

    return (
        <DragDropContext
            onDragUpdate={handleDragUpdate}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            <Droppable direction="horizontal" droppableId="list-droppable" type="LIST">
                {(provided, snapshot) => {
                    return (
                        <div
                            id="board"
                            ref={provided.innerRef}
                            onMouseDown={(e) => {
                                if (e.target.id === 'board') {
                                    setIsDragScroll(true);
                                }
                            }}
                            onMouseMove={handleDragScroll}
                            onMouseUp={() => setIsDragScroll(false)}>
                            {listsState}
                            {provided.placeholder}
                            {!isEmpty(placeHolderProps) &&
                                placeHolderProps.type === 'LIST' &&
                                snapshot.isDraggingOver && <Placeholder {...placeHolderProps} />}
                            <AddListOrCard
                                style={{ paddingRight: '25px' }}
                                scrollLeftReset={handleAddListScrollReset}
                                isFirstList={isEmpty(listsState) && true}
                                isAddList={true}
                            />
                        </div>
                    );
                }}
            </Droppable>
        </DragDropContext>
    );
};

export default ListManager;
