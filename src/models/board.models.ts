import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface IBoard extends mongoose.Document {
    name: string;
    owner: string;
    isPrivate: boolean;
    picture: string;
    members: [string];
    usersWaiting: [string];
    description: string;
    createdAt: Date;
    modifiedAt: Date;
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
    },
    { timestamps: true }
);

BoardSchema.pre('save', function (this: any, next) {
    if (!this.picture) this.picture = 'defaultBoardPicture.png';
    next();
});

// export IBoard;

export default mongoose.model<IBoard>('board', BoardSchema);
