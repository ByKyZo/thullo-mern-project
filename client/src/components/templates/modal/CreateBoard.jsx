import React, { useEffect, useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import Modal from '../../utils/Modal';
import { MdImage, MdLock } from 'react-icons/md';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { createBoard } from '../../../redux/actions/board.action';
import Button from '../../utils/Button';

const ModalCreateBoard = ({ isOpen, setIsOpen }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userReducer);
    const [picturePreview, setPicturePreview] = useState('');
    const [newBoard, setNewBoard] = useState({
        name: '',
        picture: '',
        isPrivate: false,
        owner: user._id,
    });

    useEffect(() => {
        if (!isOpen) {
            setPicturePreview('');
            setNewBoard({
                name: '',
                picture: '',
                isPrivate: false,
                owner: '',
            });
        }
    }, [isOpen]);

    const handleChangePicture = async (e) => {
        if (!e.target.files[0]) return;
        const pictureFile = await e.target.files[0];
        console.log(pictureFile);
        setNewBoard({ ...newBoard, picture: pictureFile });
        const picturePreviewURL = await URL.createObjectURL(pictureFile);
        setPicturePreview(picturePreviewURL);
    };

    const handleCreateBoard = () => {
        const data = new FormData();
        data.append('name', newBoard.name);
        data.append('picture', newBoard.picture);
        data.append('isPrivate', newBoard.isPrivate);
        data.append('owner', user._id);
        setIsOpen(false);
        dispatch(createBoard(data));
    };

    return (
        <>
            <Modal hasCloseButton={true} isOpen={isOpen} setIsOpen={setIsOpen}>
                <div className="createboardmodal">
                    <label
                        className={`createboardmodal__input__image ${
                            picturePreview ? '' : 'no-preview'
                        }`}
                        htmlFor="boardmodal_input_image"
                        style={{ backgroundImage: `url(${picturePreview})` }}>
                        <div className={`${picturePreview ? 'preview-background' : ''}`}>
                            <IoIosAddCircleOutline
                                className={`createboardmodal__input__image__icon ${
                                    picturePreview ? 'preview-active' : ''
                                }`}
                            />
                        </div>
                        <input
                            type="file"
                            id="boardmodal_input_image"
                            onChange={handleChangePicture}
                            accept=".png , .jpg , .jpeg"
                            hidden
                        />
                    </label>
                    <input
                        value={newBoard.name}
                        onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                        maxLength="20"
                        className="createboardmodal__input__name"
                        type="text"
                        placeholder="Add board title"
                    />
                    <div className="createboardmodal__button__wrapper">
                        <Button className="createboardmodal__button__wrapper__item">
                            <MdImage className="createboardmodal__button__wrapper__item__icon" />{' '}
                            Cover
                        </Button>
                        <Button
                            className={`createboardmodal__button__wrapper__item ${
                                newBoard.isPrivate ? 'isStateActiveCreateBoard' : ''
                            }`}
                            onClick={() =>
                                setNewBoard((oldNewBoard) => {
                                    oldNewBoard.isPrivate = !oldNewBoard.isPrivate;
                                    return { ...oldNewBoard };
                                })
                            }>
                            <MdLock className="createboardmodal__button__wrapper__item__icon" />{' '}
                            Private
                        </Button>
                    </div>
                    <div className="createboardmodal__board">
                        <Button
                            className="createboardmodal__board__cancel"
                            onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="createboardmodal__board__create"
                            onClick={() => handleCreateBoard()}>
                            <RiAddFill className="createboardmodal__board__create__icon" />{' '}
                            <span className="createboardmodal__board__create__label">Create</span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalCreateBoard;
