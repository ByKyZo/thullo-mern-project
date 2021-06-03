import React, { useEffect, useRef, useState } from 'react';
import { insertSpecialCharacter, removeHtmlClass, removeHtmlStyle } from '../../utils/utils';
import Button from '../utils/Button';
import { MdInsertEmoticon } from 'react-icons/md';
import EmojiPicker from './EmojiPicker';

const ContentEditable = ({ setIsOpen, content, submitFunc, HTMLInjectedRef }) => {
    // const [innerContent, setInnerContent] = useState('');
    const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useState(false);
    const editorRef = useRef();
    const descriptionRef = useRef();
    const outputRef = useRef();

    const parseValue = (value) => {
        return value.replaceAll(
            /\*[a-z0-1A-Z]+/g,
            '<span class="description-word-important">$&</span>'
        );
    };
    const handleSaveDescription = async () => {
        submitFunc && submitFunc(removeHtmlStyle(outputRef.current.innerHTML));
    };

    useEffect(() => {
        outputRef.current.innerHTML = content;
        descriptionRef.current.innerHTML = removeHtmlClass(outputRef.current.innerHTML);
        // setInnerContent(outputRef.current.textContent);
    }, [descriptionRef, content]);

    const handleFormatDescription = (e) => {
        if (e.keyCode === 9) {
            e.preventDefault();
            insertSpecialCharacter(descriptionRef, 0x0009);
            outputRef.current.innerHTML = parseValue(descriptionRef.current.innerHTML);
        }
    };

    const handleSetDescription = (e) => {
        // setInnerContent(e.target.textContent);
        outputRef.current.innerHTML = removeHtmlStyle(parseValue(e.target.innerHTML));
    };

    return (
        <>
            <div className="editdescription__wrapper" ref={editorRef}>
                <div
                    onKeyDown={handleFormatDescription}
                    spellCheck={false}
                    onInput={handleSetDescription}
                    ref={descriptionRef}
                    className="editdescription__wrapper__input"
                    contentEditable={true}
                />
                <div ref={outputRef} className="editdescription__wrapper__output"></div>
                <button
                    className="editdescription__wrapper__btn-emoji"
                    onClick={() => setIsOpenEmojiPicker(true)}>
                    <MdInsertEmoticon />
                </button>
                <EmojiPicker
                    allowsRef={editorRef}
                    isOpen={isOpenEmojiPicker}
                    setIsOpen={setIsOpenEmojiPicker}
                />
            </div>
            {/* <div className="editdescription__chars-wrapper">
                <span className="editdescription__chars-wrapper__item">
                    max chars : {MAX_CHARS}
                </span>
                <span
                    className={`editdescription__chars-wrapper__item ${
                        innerContent.length > MAX_CHARS ? 'maxchars-error' : ''
                    }`}>
                    current chars : {innerContent.length}
                </span>
            </div> */}

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

export default ContentEditable;
