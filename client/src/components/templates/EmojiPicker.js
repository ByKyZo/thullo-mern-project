import React from 'react';
import { insertSpecialCharacter } from '../../utils/utils';
import DropDown from '../utils/Dropdown';

const EmojiPicker = ({ isOpen, setIsOpen, allowsRef }) => {
    // Faire du call API ici : https://emoji-api.com/
    // insertSpecialCharacter() Afficher les emojis
    return (
        <DropDown
            allowsRef={allowsRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            bottom="-160px"
            right="-8px">
            <div className="emojipicker">
                <h4>Emoji Picker</h4>
            </div>
        </DropDown>
    );
};

export default EmojiPicker;
