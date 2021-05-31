import React, { useEffect, useState } from 'react';
import CategoryTitle from '../../../layouts/CategoryTitle';
import { MdDescription, MdAdd } from 'react-icons/md';
import Button from '../../../utils/Button';
import axios from '../../../../utils/axios';
import download from 'downloadjs';
import { cutMongooseTimestampInDate, getPicturePath, isEmpty } from '../../../../utils/utils';
import socket from '../../../../utils/socket';

const Attachments = ({ boardID, listID, cardID, attachments }) => {
    const [attachmentsState, setAttachmentsState] = useState([]);

    useEffect(() => setAttachmentsState(attachments), [attachments]);

    useEffect(() => {
        socket.on('delete attachment', ({ attachmentID }) => {
            setAttachmentsState((oldAttachment) =>
                oldAttachment.filter((attach) => attach._id !== attachmentID)
            );
        });
    }, []);

    const isPicture = (file) => {
        const fileExtension = file.match(/\.[0-9a-z]+$/i)[0].toLowerCase();

        return fileExtension === '.png' || fileExtension === '.jpg' || fileExtension === '.jpeg';
    };

    const handleDeleteAttachement = (attachmentID) => {
        socket.emit('delete attachment', { boardID, listID, cardID, attachmentID });
    };

    const handleAddAttachement = (e) => {
        const formData = new FormData();
        formData.append('attachment', e.target.files[0]);
        formData.append('boardID', boardID);
        formData.append('listID', listID);
        formData.append('cardID', cardID);

        axios
            .post('/board/list/card/attachment', formData)
            .then((res) => {
                setAttachmentsState([...attachmentsState, res.data]);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleFormatDate = (createdAt) => {
        if (isEmpty(createdAt)) return;
        const { dayNum, monthLetter, years } = cutMongooseTimestampInDate(createdAt);
        return `Added ${monthLetter} ${dayNum}, ${years}`;
    };

    const handleDownloadAttachment = (name, filePath) => {
        axios
            .post('/board/list/card/download-attachment', { filePath }, { responseType: 'blob' })
            .then((res) => {
                console.log(res);
                download(res.data, name);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="cardmodal__content__left__attachements">
            <div className="cardmodal__content__left__attachements__head">
                <CategoryTitle
                    icon={<MdDescription />}
                    title="Attachements"
                    withMarginBottom={false}
                />
                <label
                    className="cardmodal__content__left__attachements__head__btn-add"
                    htmlFor="upload-attachement">
                    {/* <Button className="cardmodal__content__left__attachements__head__btn-add">
                    <MdAdd className="cardmodal__content__left__attachements__head__btn-add__icon" />
                    <span className="cardmodal__content__left__attachements__head__btn-add__label">
                        Add
                    </span>
                        </Button> */}
                    <MdAdd className="cardmodal__content__left__attachements__head__btn-add__icon" />
                    <span className="cardmodal__content__left__attachements__head__btn-add__label">
                        Add
                    </span>
                    <input
                        type="file"
                        onChange={(e) => handleAddAttachement(e)}
                        name=""
                        id="upload-attachement"
                    />
                </label>
            </div>
            <ul className="cardmodal__content__left__attachements__list">
                {attachmentsState.map(({ _id, name, filePath, createdAt }, index) => {
                    return (
                        <li
                            key={index}
                            className="cardmodal__content__left__attachements__list__item">
                            <div className="cardmodal__content__left__attachements__list__item__left">
                                {isPicture(name) ? (
                                    <img
                                        className="cardmodal__content__left__attachements__list__item__left__img"
                                        src={getPicturePath('attachment', filePath)}
                                        alt="attachment"
                                    />
                                ) : (
                                    <span>{name.substring(0, 2)}</span>
                                )}
                            </div>
                            <div className="cardmodal__content__left__attachements__list__item__right">
                                <span className="cardmodal__content__left__attachements__list__item__right__date">
                                    {handleFormatDate(createdAt)}
                                </span>
                                <h4 className="cardmodal__content__left__attachements__list__item__right__name">
                                    {name}
                                </h4>
                                <div className="cardmodal__content__left__attachements__list__item__right__btn-wrapper">
                                    <Button
                                        className="cardmodal__content__left__attachements__list__item__right__btn-wrapper__item"
                                        onClick={() => handleDownloadAttachment(name, filePath)}>
                                        Download
                                    </Button>
                                    <Button
                                        className="cardmodal__content__left__attachements__list__item__right__btn-wrapper__item"
                                        onClick={() => handleDeleteAttachement(_id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Attachments;
