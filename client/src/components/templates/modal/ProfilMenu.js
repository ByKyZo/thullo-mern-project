import React from 'react';
import DropDown from '../../utils/Dropdown';

const ProfilMenu = ({ isOpen, setIsOpen }) => {
    return (
        <DropDown isOpen={isOpen} setIsOpen={setIsOpen} top="50px" right="-8px">
            <div className="profilmenu">
                <ul className="profilmenu__navlist">
                    <li className="profilmenu__navlist__item">Profil</li>
                    <li className="profilmenu__navlist__item">Notifications</li>
                    <li className="profilmenu__navlist__item">Logout</li>
                </ul>
            </div>
        </DropDown>
    );
};

export default ProfilMenu;
