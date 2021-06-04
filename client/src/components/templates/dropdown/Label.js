import React, { useEffect, useState } from 'react';
import { MdLabel } from 'react-icons/md';
import DropDown from '../../utils/Dropdown';
import Button from '../../utils/Button';
import CategoryTitle from '../../layouts/CategoryTitle';
import socket from '../../../utils/socket';
import { clearToastByTypes, isEmpty, successToast, warningToast } from '../../../utils/utils';
import CardLabel from '../board/CardLabel';
// const colors = {
//     darkGreen: '#219653',
//     yellow: '#F2C94C',
//     orange: '#F2994A',
//     red: '#EB5757',
//     blue: '#2F80ED',
//     cyan: '#56CCF2',
//     lightGreen: '#6FCF97',
//     veryDarkGray: '#333333',
//     darkGray: '#4F4F4F',
//     midGray: '#828282',
//     lightGray: '#BDBDBD',
//     gray: '#E0E0E0',
// };
const Label = ({ labels, boardID, listID, cardID, isOpen, setIsOpen }) => {
    const [labelsState, setLabelsState] = useState([]);
    const [labelName, setLabelName] = useState('');
    const [colorSelected, setColorSelected] = useState();

    useEffect(() => {
        if (isEmpty(labels)) return;
        setLabelsState(labels);
    }, [labels, isOpen]);

    const colors = {
        darkGreen: '33, 150, 83',
        yellow: '242, 201, 76',
        orange: '242, 153, 74',
        red: '235, 87, 87',
        blue: '47, 128, 237',
        cyan: '86, 204, 242',
        lightGreen: '111, 207, 151',
        veryDarkGray: '51, 51, 51',
        darkGray: '79, 79, 79',
        midGray: '130, 130, 130',
        lightGray: '189, 189, 189',
        gray: '224, 224, 224',
    };

    useEffect(() => {
        const currentCardID = cardID;
        socket.on('card add label', ({ boardID, listID, cardID, label }) => {
            if (currentCardID === cardID) {
                setLabelsState((oldLabels) => {
                    return [...oldLabels, label];
                });
            }
        });
        socket.on('card delete label', ({ boardID, listID, cardID, labelID }) => {
            if (currentCardID === cardID) {
                setLabelsState((oldLabels) => {
                    return oldLabels.filter((label) => label._id !== labelID);
                });
            }
        });
    }, [cardID]);

    const handleAddLabel = () => {
        if (!labelName) return warningToast('Missing label name');
        if (!colorSelected) return warningToast('Missing label color');
        clearToastByTypes('warning');
        successToast('Label created');
        socket.emit('card add label', { boardID, listID, cardID, labelName, color: colorSelected });
    };

    const handleDeleteLabel = (labelID) => {
        socket.emit('card delete label', { boardID, listID, cardID, labelID });
    };

    const handleReturnColorItem = () => {
        const colorsItems = [];
        for (let color in colors) {
            colorsItems.push(
                <button
                    key={color}
                    onClick={() => {
                        colors[color] === colorSelected
                            ? setColorSelected('')
                            : setColorSelected(colors[color]);
                    }}
                    style={{ backgroundColor: `rgba(${colors[color]}, 1)` }}
                    className={`label__colorpicker__item ${
                        colorSelected === colors[color] ? 'color-selected' : ''
                    }`}
                />
            );
        }
        return colorsItems;
    };

    return (
        <DropDown
            wrapperClass="dropdown-label"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            top="46px"
            contentClass="label"
            title="Label"
            description="Select a name and a color">
            <input
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                placeholder="Label..."
                className="label__input"
                type="text"
            />
            <div className="label__colorpicker">{handleReturnColorItem()}</div>
            <div className="label__available">
                <CategoryTitle icon={<MdLabel />} title="Available " />
                <div className="label__available__container">
                    {!isEmpty(labelsState) &&
                        labelsState.map((label) => {
                            return (
                                // <span style={{display : 'flex'}}>
                                <CardLabel
                                    onClick={() => handleDeleteLabel(label._id)}
                                    style={{ marginBottom: '8px' }}
                                    key={label._id}
                                    name={label.name}
                                    color={label.color}
                                    isDeleted={true}
                                />
                                // </span>
                            );
                        })}
                </div>
            </div>
            <Button className="label__btn-add" onClick={() => handleAddLabel()}>
                Add
            </Button>
        </DropDown>
    );
};

export default Label;
