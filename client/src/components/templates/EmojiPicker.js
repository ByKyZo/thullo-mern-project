import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
// import { insertSpecialCharacter } from '../../utils/utils';
import DropDown from '../utils/Dropdown';
import { VscChromeClose } from 'react-icons/vsc';

const EmojiPicker = ({ isOpen, setIsOpen, allowsRef }) => {
    // Faire du call API ici : https://emoji-api.com/
    // insertSpecialCharacter() Afficher les emojis
    const [emoji, setEmoji] = useState([]);

    useEffect(() => {
        axios
            .get(
                'https://emoji-api.com/categories/travel-places?access_key=c73293510309d49f6b5de5ad0badf72689ddf3ec'
            )
            .then((res) => {
                setEmoji(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <DropDown
            allowsRef={allowsRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            bottom="-160px"
            right="-8px">
            <div className="emojipicker">
                <div className="emojipicker__category">
                    <button
                        className="emojipicker__category__btn-close"
                        onClick={() => setIsOpen(false)}>
                        <VscChromeClose />
                    </button>
                </div>
                <div className="emojipicker__content">
                    {emoji.map((emo, index) => {
                        return (
                            <button key={index} className="emojipicker__content__item">
                                {emo.character}
                            </button>
                        );
                    })}
                </div>
            </div>
        </DropDown>
    );
};

export default EmojiPicker;
