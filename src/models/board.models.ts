import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const BoardSchema = new Schema({
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
});

BoardSchema.pre('save', function (this: any, next) {
    if (!this.picture) this.picture = 'defaultBoardPicture.png';
    next();
});

export default mongoose.model('board', BoardSchema);
