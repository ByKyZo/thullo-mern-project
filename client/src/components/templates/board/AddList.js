import React from 'react';
import { MdAdd } from 'react-icons/md';

const AddList = ({ isNewTable = false }) => {
    return (
        <>
            {isNewTable ? (
                <div style={{ paddingRight: '25px' }}>
                    <button className="board__content__table__btn-addlist">
                        <span>Add another list</span>
                        <MdAdd className="board__content__table__btn-addlist__icon" />
                    </button>
                </div>
            ) : (
                <button className="board__content__table__btn-addlist">
                    <span>Add another list</span>
                    <MdAdd className="board__content__table__btn-addlist__icon" />
                </button>
            )}
        </>
    );
};

export default AddList;
