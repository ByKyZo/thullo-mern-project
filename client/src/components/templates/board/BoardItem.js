import React from 'react';
import { Link } from 'react-router-dom';
import { getPicturePath } from '../../../utils/utils';
import { v4 as uuid } from 'uuid';

const BoardItem = ({ _id, name, picture, members }) => {
    const MEMBER_MAX_LENGTH = 3;

    return (
        <Link to={`/board/${_id}`} className="allboards__container__items">
            <img
                className="allboards__container__items__img"
                src={getPicturePath('board', picture)}
                alt={`board ${name}`}
            />
            <span className="allboards__container__items__title">{name}</span>
            <ul className="allboards__container__items__members">
                {members
                    .map(({ _id, pseudo, picture }, index) => {
                        if (index === MEMBER_MAX_LENGTH)
                            return (
                                <span
                                    key={uuid()}
                                    className="allboards__container__items__members__others">
                                    +{members.length - MEMBER_MAX_LENGTH} Others
                                </span>
                            );
                        return (
                            <li key={_id} className="allboards__container__items__members__profil">
                                <img
                                    src={getPicturePath('user', picture)}
                                    alt={`${pseudo} profil`}></img>
                            </li>
                        );
                    })
                    .slice(0, MEMBER_MAX_LENGTH + 1)}
            </ul>
        </Link>
    );
};

export default BoardItem;
