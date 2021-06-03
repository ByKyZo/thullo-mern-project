import React, { useEffect, useRef, useState } from 'react';
import { closeOnClickOutside, getPicturePath } from '../../../utils/utils';
import Button from '../../utils/Button';

const CommentBox = ({ content, setContent, submitFunc, isNewComment = true, userPicture }) => {
    const commentBoxRef = useRef();
    const commentRef = useRef();
    const [isDisabledPlaceholder, setIsDisabledPlaceholder] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        if (!content && isFocus) setIsDisabledPlaceholder(false);
        // setIsDisabledPlaceholder(true);
        commentRef.current.textContent = content;
        closeOnClickOutside(commentBoxRef, setIsFocus);
    }, [content]);

    const handleSubmit = () => {
        if (!content) return commentRef.current.focus();
        submitFunc();
        setContent('');
        commentRef.current.innerHTML = '';
    };

    const handleOnFocus = () => {
        setIsDisabledPlaceholder(true);
        setIsFocus(true);
    };

    const handleOnBlur = () => {
        !content && setIsDisabledPlaceholder(false);
    };

    const handleSetComment = () => {
        setContent(commentRef.current.textContent);
        if (!content) setIsDisabledPlaceholder(true);
    };

    return (
        <div className="commentbox" ref={commentBoxRef}>
            <div className="commentbox__head">
                <img src={getPicturePath('user', userPicture)} alt="" />
                <div className="commentbox-input-wrapper">
                    <div
                        ref={commentRef}
                        onFocus={() => handleOnFocus()}
                        onBlur={() => handleOnBlur()}
                        onInput={() => handleSetComment()}
                        className="commentbox-input-wrapper__input"
                        contentEditable={true}></div>
                    {!isDisabledPlaceholder && (
                        <span className="commentbox-input-wrapper__placeholder">
                            Write a comment...
                        </span>
                    )}
                </div>
            </div>

            <div className={`commentbox__toolbar ${isFocus ? 'commentbox__toolbar--open' : ''}`}>
                <Button onClick={() => handleSubmit()}>{isNewComment ? 'Comment' : 'Save'}</Button>
            </div>
        </div>
    );
};

export default CommentBox;
