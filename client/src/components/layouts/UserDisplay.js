import React from 'react';
import { getPicturePath } from '../../utils/utils';

const UserDisplay = ({ pseudo, picture }) => {
    return (
        <li className="userdisplay">
            <img className="userdisplay__img" src={getPicturePath('user', picture)} alt="" />
            <span className="userdisplay__name">{pseudo}</span>
        </li>
    );
};

export default UserDisplay;
