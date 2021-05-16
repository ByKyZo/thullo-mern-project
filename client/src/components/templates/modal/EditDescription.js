import React, { useEffect, useRef, useState } from 'react';
import socket from '../../../utils/socket';
import { insertSpecialCharacter, warningToast } from '../../../utils/utils';
import Button from '../../utils/Button';
import { MdInsertEmoticon } from 'react-icons/md';
import EmojiPicker from '../EmojiPicker';

const MAX_CHARS = 600;

const EditDescription = ({ setIsOpen, description, boardID }) => {
    // CONTROLLER LE TEXT AREA SINON FONCTIONNE PAS C4EST SUR !!!
    const [newDescription, setNewDescription] = useState('');
    const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);
    const descriptionRef = useRef();

    const parseValue = (value) => {
        return value.replace(/#[a-z0-1A-Z]+/g, '<strong>$&</strong>');
    };

    const handleSaveDescription = () => {
        if (newDescription.length > MAX_CHARS)
            return warningToast(`Description is too long (max chars : ${MAX_CHARS})`);
        const description = descriptionRef.current.innerHTML;
        setIsOpen(false);
        socket.emit('change description', { description, boardID });
    };

    useEffect(() => {
        descriptionRef.current.innerHTML = parseValue(description);
        const descWithoutHTMLTags = description.replaceAll(/(<([^>]+)>)/gi, '');
        setNewDescription(descWithoutHTMLTags);
    }, [descriptionRef]);

    const handleFormatDescription = (e) => {
        // descriptionRef.current.innerHTML = parseValue(description);
        if (e.keyCode === 9) {
            e.preventDefault();
            insertSpecialCharacter(descriptionRef, 0x0009);
        }
    };

    const handleSetDescription = (e) => {
        // FAIRE UN TEXT AREA ET UN CONTENT EDITABLE
        descriptionRef.current.innerHTML = parseValue(e.target.value);
    };

    return (
        <>
            <div className="editdescription__wrapper">
                <textarea
                    spellCheck={false}
                    value={newDescription}
                    className="editdescription__wrapper__input"
                    onChange={(e) => handleSetDescription(e)}
                />
                <div
                    ref={descriptionRef}
                    onKeyDown={handleFormatDescription}
                    className="editdescription__wrapper__output"
                    contentEditable={true}>
                    {/* {description} */}
                    {/* {newDescription} */}
                </div>
                <button
                    className="editdescription__wrapper__btn-emoji"
                    onClick={() => setIsOpenEmojiPicker(true)}>
                    <MdInsertEmoticon />
                </button>
                <EmojiPicker
                    allowsRef={descriptionRef}
                    isOpen={isOpenEmojiPicker}
                    setIsOpen={setIsOpenEmojiPicker}
                />
            </div>
            <div className="editdescription__chars-wrapper">
                <span className="editdescription__chars-wrapper__item">
                    max chars : {MAX_CHARS}
                </span>
                <span
                    className={`editdescription__chars-wrapper__item ${
                        newDescription.length > MAX_CHARS ? 'maxchars-error' : ''
                    }`}>
                    current chars : {newDescription.length}
                </span>
            </div>

            <div className="editdescription__btn-wrapper">
                <Button
                    className="editdescription__btn-wrapper__btn-send"
                    onClick={() => handleSaveDescription()}>
                    Save
                </Button>
                <button
                    className="editdescription__btn-wrapper__btn-cancel"
                    onClick={() => setIsOpen(false)}>
                    Cancel
                </button>
            </div>
        </>
    );
};

export default EditDescription;
