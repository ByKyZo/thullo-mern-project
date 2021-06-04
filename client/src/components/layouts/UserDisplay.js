import React from 'react';
import { getPicturePath } from '../../utils/utils';

const UserDisplay = ({ pseudo, picture, pseudoClass = '', imgClass = '' }) => {
    return (
        <li className="userdisplay">
            <img
                className={`userdisplay__img ${imgClass}`}
                src={getPicturePath('user', picture)}
                alt=""
            />
            <span className={`userdisplay__name ${pseudoClass}`}>{pseudo}</span>
        </li>
    );
};

export default UserDisplay;
