import React, { useEffect, useState } from 'react';
import { isEmpty } from '../../../utils/utils';

const Placeholder = ({ destinationIndex, draggableID, currentListOverID, type }) => {
    const queryAttrDraggable = 'data-rbd-drag-handle-draggable-id';
    const queryAttrDroppable = 'data-rbd-droppable-id';
    const [placeholderProps, setPlaceholderProps] = useState({});

    useEffect(() => {
        if (draggableID) {
            const domQuery = `[${queryAttrDraggable}='${draggableID}']`;
            const domListQuery = `[${queryAttrDroppable}='${currentListOverID}']`;
            const draggedDOM = document.querySelector(domQuery);
            const listOverDOM = document.querySelector(domListQuery);

            if (!draggedDOM) {
                return;
            }
            const { clientHeight, clientWidth } = draggedDOM;
            if (type === 'CARD') {
                const clientY =
                    parseFloat(
                        window.getComputedStyle(listOverDOM ? listOverDOM : draggedDOM.parentNode)
                            .paddingTop
                    ) +
                    [...(listOverDOM ? listOverDOM.children : draggedDOM.parentNode.children)]
                        .slice(0, destinationIndex)
                        .reduce((total, curr) => {
                            const style = curr.currentStyle || window.getComputedStyle(curr);
                            const marginBottom = parseFloat(style.marginBottom);
                            return total + curr.clientHeight + marginBottom;
                        }, 0);
                setPlaceholderProps({
                    clientHeight,
                    clientWidth,
                    clientY,
                    clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
                });
            } else if (type === 'LIST') {
                const clientX =
                    parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft) +
                    [...draggedDOM.parentNode.children]
                        .slice(0, destinationIndex)
                        .reduce((total, curr) => {
                            const style = curr.currentStyle || window.getComputedStyle(curr);
                            const marginRight = parseFloat(style.marginRight);
                            return total + curr.clientWidth + marginRight;
                        }, 0);

                setPlaceholderProps({
                    clientHeight,
                    clientWidth,
                    clientY: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop),
                    clientX,
                });
            }
        }
    }, [draggableID, destinationIndex, type, currentListOverID]);

    return (
        <>
            {!isEmpty(placeholderProps) && (
                <div
                    className="dndplaceholder"
                    style={{
                        position: 'absolute',
                        top: placeholderProps.clientY,
                        left: placeholderProps.clientX,
                        height: placeholderProps.clientHeight,
                        width: placeholderProps.clientWidth,
                    }}
                />
            )}
        </>
    );
};

export default Placeholder;
