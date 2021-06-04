import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DropDown from '../../utils/Dropdown';
import socket from '../../../utils/socket';

const PicturePicker = ({ isOpen, setIsOpen, boardID, listID, cardID }) => {
    const [pictureSearch, setPictureSearch] = useState('');
    const [pictures, setPictures] = useState([]);

    useEffect(() => {
        const randomPage = Math.floor(1 + Math.random() * 30);
        axios
            .get('https://api.unsplash.com/photos', {
                params: { per_page: '12', page: randomPage },
                headers: { Authorization: 'Client-ID FStR-mHl49Em5PReprA_w0cQgQBzXRyI0rjzd3GXzTY' },
            })
            .then((res) => {
                setPictures(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        return () => {
            setPictures([]);
        };
    }, []);

    const handleChangeCardPicture = (picture) => {
        // console.log(picture.urls.regular);
        // console.log(picture.urls.full);
        socket.emit('card change picture', {
            boardID,
            listID,
            cardID,
            picture: picture.urls.regular,
        });
    };

    return (
        <DropDown
            wrapperClass="dropdown-picturepicker"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Photo Search"
            description="Search Unsplash for photos"
            contentClass="picturepicker">
            <input className="picturepicker__input" placeholder="Keywords..." type="text" />
            <div className="picturepicker__content">
                {pictures.map((picture) => {
                    return (
                        <button
                            className="picturepicker__content__picture"
                            key={picture.id}
                            onClick={() => handleChangeCardPicture(picture)}>
                            <img src={picture.urls.thumb} alt="" />
                        </button>
                    );
                })}
            </div>
        </DropDown>
    );
};

export default PicturePicker;
