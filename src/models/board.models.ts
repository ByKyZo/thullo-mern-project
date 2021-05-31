import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IBoard extends mongoose.Document {
    name: string;
    owner: string | IUser;
    isPrivate: boolean;
    picture: string;
    members: string[] | IUser[];
    usersWaiting: string[];
    description: string;
    createdAt: Date;
    modifiedAt: Date;
    NOT_MEMBER: boolean;
    lists: IList[];
}

export interface IList extends mongoose.Document {
    _id: string;
    name: string;
    order: number;
    cards: ICard[];
}

export interface ICard extends mongoose.Document {
    _id: string;
    title: string;
    picture: string;
    members: string[] | IUser[];
    description: string;
    labels: [
        {
            name: string;
            color: string;
        }
    ];
    attachments: [
        {
            name: string;
            filePath: string;
        }
    ];
    comments: [
        {
            userID: string;
            message: string;
        }
    ];
}

const BoardSchema = new Schema(
    {
        name: {
            type: String,
            min: 4,
            max: 12,
            required: true,
        },
        owner: {
            type: String,
            required: true,
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
        picture: {
            type: String,
            default: 'defaultBoardPicture.png',
        },
        members: {
            type: [String],
        },
        usersWaiting: {
            type: [String],
        },
        description: {
            type: String,
            default: 'Ceci est une description',
        },
        lists: [
            {
                name: {
                    type: String,
                    required: true,
                },
                cards: [
                    {
                        title: {
                            type: String,
                            default: 'CardName',
                        },
                        picture: {
                            type: String,
                        },
                        description: {
                            type: String,
                            default: '',
                        },
                        members: {
                            type: [String],
                        },
                        labels: [
                            {
                                name: {
                                    type: String,
                                },
                                color: {
                                    type: String,
                                },
                            },
                        ],
                        attachments: [
                            {
                                name: {
                                    type: String,
                                },
                                filePath: {
                                    type: String,
                                },
                                createdAt: {
                                    type: Date,
                                },
                            },
                        ],
                        comment: [
                            {
                                userID: {
                                    type: String,
                                },
                                message: {
                                    type: String,
                                },
                            },
                            { timestamps: true },
                        ],
                    },
                ],
            },
        ],
    },
    { timestamps: true }
);

BoardSchema.pre('save', function (this: any, next) {
    if (!this.picture) this.picture = 'defaultBoardPicture.png';
    next();
});

// export IBoard;

export default mongoose.model<IBoard>('board', BoardSchema);
