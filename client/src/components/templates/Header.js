import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../../components/utils/Button';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { BsGrid3X3Gap } from 'react-icons/bs';
import MediaQuery from 'react-responsive';
import DropDown from '../utils/Dropdown';
import { addToast, getPicturePath, isEmpty } from '../../utils/utils';
import ProfilMenu from './dropdown/ProfilMenu';

const Header = ({ isHeaderBoard, boardName }) => {
    const user = useSelector((state) => state.userReducer);
    const [isOpenSearchBar, setIsOpenSearchBar] = useState(false);
    const [isOpenProfilMenu, setIsOpenProfilMenu] = useState(false);
    const [test, setTest] = useState(1);

    return (
        <>
            <header className="header">
                <div className="header__left">
                    <Link className="header__left__logo" to="/allboards">
                        <MediaQuery minWidth="650px">
                            <svg
                                width="98"
                                height="29"
                                viewBox="0 0 98 29"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M54.3311 8.436V10.47H50.9831V21H48.4631V10.47H45.1151V8.436H54.3311ZM61.1557 10.884C61.9117 10.884 62.5837 11.052 63.1717 11.388C63.7597 11.712 64.2157 12.198 64.5397 12.846C64.8757 13.482 65.0437 14.25 65.0437 15.15V21H62.5237V15.492C62.5237 14.7 62.3257 14.094 61.9297 13.674C61.5337 13.242 60.9937 13.026 60.3097 13.026C59.6137 13.026 59.0617 13.242 58.6537 13.674C58.2577 14.094 58.0597 14.7 58.0597 15.492V21H55.5397V7.68H58.0597V12.27C58.3837 11.838 58.8157 11.502 59.3557 11.262C59.8957 11.01 60.4957 10.884 61.1557 10.884ZM76.2241 11.028V21H73.6861V19.74C73.3621 20.172 72.9361 20.514 72.4081 20.766C71.8921 21.006 71.3281 21.126 70.7161 21.126C69.9361 21.126 69.2461 20.964 68.6461 20.64C68.0461 20.304 67.5721 19.818 67.2241 19.182C66.8881 18.534 66.7201 17.766 66.7201 16.878V11.028H69.2401V16.518C69.2401 17.31 69.4381 17.922 69.8341 18.354C70.2301 18.774 70.7701 18.984 71.4541 18.984C72.1501 18.984 72.6961 18.774 73.0921 18.354C73.4881 17.922 73.6861 17.31 73.6861 16.518V11.028H76.2241ZM80.6005 7.68V21H78.0805V7.68H80.6005ZM84.9803 7.68V21H82.4603V7.68H84.9803ZM91.268 21.162C90.308 21.162 89.444 20.952 88.676 20.532C87.908 20.1 87.302 19.494 86.858 18.714C86.426 17.934 86.21 17.034 86.21 16.014C86.21 14.994 86.432 14.094 86.876 13.314C87.332 12.534 87.95 11.934 88.73 11.514C89.51 11.082 90.38 10.866 91.34 10.866C92.3 10.866 93.17 11.082 93.95 11.514C94.73 11.934 95.342 12.534 95.786 13.314C96.242 14.094 96.47 14.994 96.47 16.014C96.47 17.034 96.236 17.934 95.768 18.714C95.312 19.494 94.688 20.1 93.896 20.532C93.116 20.952 92.24 21.162 91.268 21.162ZM91.268 18.966C91.724 18.966 92.15 18.858 92.546 18.642C92.954 18.414 93.278 18.078 93.518 17.634C93.758 17.19 93.878 16.65 93.878 16.014C93.878 15.066 93.626 14.34 93.122 13.836C92.63 13.32 92.024 13.062 91.304 13.062C90.584 13.062 89.978 13.32 89.486 13.836C89.006 14.34 88.766 15.066 88.766 16.014C88.766 16.962 89 17.694 89.468 18.21C89.948 18.714 90.548 18.966 91.268 18.966Z"
                                    fill="#333333"
                                    className="header__left__logo__label"
                                />

                                <path
                                    d="M0 4C0 1.79086 1.79086 0 4 0H10C12.2091 0 14 1.79086 14 4V25C14 27.2091 12.2091 29 10 29H4C1.79086 29 0 27.2091 0 25V4Z"
                                    fill="#2F80ED"
                                    className="header__left__logo__left"
                                />
                                <path
                                    d="M18 4C18 1.79086 19.7909 0 22 0H28C30.2091 0 32 1.79086 32 4V14C32 16.2091 30.2091 18 28 18H22C19.7909 18 18 16.2091 18 14V4Z"
                                    fill="#2F80ED"
                                    className="header__left__logo__right"
                                />
                            </svg>
                        </MediaQuery>
                        <MediaQuery maxWidth="649px">
                            <svg
                                width="32"
                                height="29"
                                viewBox="0 0 32 29"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0 4C0 1.79086 1.79086 0 4 0H10C12.2091 0 14 1.79086 14 4V25C14 27.2091 12.2091 29 10 29H4C1.79086 29 0 27.2091 0 25V4Z"
                                    fill="#2F80ED"
                                    className="header__left__logo__left"
                                />
                                <path
                                    d="M18 4C18 1.79086 19.7909 0 22 0H28C30.2091 0 32 1.79086 32 4V14C32 16.2091 30.2091 18 28 18H22C19.7909 18 18 16.2091 18 14V4Z"
                                    fill="#2F80ED"
                                    className="header__left__logo__right"
                                />
                            </svg>
                        </MediaQuery>
                    </Link>
                    {isHeaderBoard && (
                        <div className="header__left__board">
                            <h2 className="header__left__board__name">{boardName}</h2>
                            <span className="header__left__board__divider"></span>
                            <Link to="/allboards" className="header__left__board__btn-allboard">
                                <BsGrid3X3Gap className="header__left__board__btn-allboard__icons" />
                                <span className="header__left__board__btn-allboard__label">
                                    All board
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="header__right">
                    <MediaQuery minWidth="1100px">
                        <div className="header__right__search">
                            <input
                                className="header__right__search__input"
                                type="text"
                                placeholder="Keyword..."
                            />
                            <Button
                                className="header__right__search__button"
                                onClick={() => {
                                    addToast(<BsFillCaretDownFill />, `test ${test}`, 'success');
                                    setTest(test + 1);
                                }}>
                                Search
                            </Button>
                        </div>
                    </MediaQuery>
                    <MediaQuery maxWidth="1099px">
                        <div className="header__right__search__responsive">
                            <Button
                                className="header__right__search__responsive__button"
                                onClick={() => setIsOpenSearchBar(true)}>
                                Search
                            </Button>
                            {/* {isOpenSearchBar && ( */}
                            <DropDown
                                left="-170px"
                                top="46px"
                                isOpen={isOpenSearchBar}
                                setIsOpen={setIsOpenSearchBar}>
                                <div className="header__right__search__responsive__dropdown__wrapper">
                                    <input
                                        className={`header__right__search__responsive__dropdown__wrapper__input `}
                                        type="text"
                                        placeholder="Keyword..."
                                    />
                                </div>
                            </DropDown>
                            {/* )} */}
                        </div>
                    </MediaQuery>
                    <button
                        className="header__right__profil"
                        onClick={() => setIsOpenProfilMenu(true)}>
                        <img
                            className="header__right__profil__img"
                            src={getPicturePath('user', user.picture)}
                            alt="p"
                        />
                        <span className="header__right__profil__name">{user.pseudo}</span>
                        <span className="header__right__profil__icon">
                            <BsFillCaretDownFill />
                        </span>
                        {!isEmpty(user.notifications) && (
                            <span
                                className="bubble-notifications"
                                style={{ fontSize: user.notifications.length > 99 && '0.6rem' }}>
                                {user.notifications.length > 99 ? '99+' : user.notifications.length}
                            </span>
                        )}
                    </button>
                    <ProfilMenu isOpen={isOpenProfilMenu} setIsOpen={setIsOpenProfilMenu} />
                </div>
            </header>
        </>
    );
};

export default Header;
