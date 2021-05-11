import mongoose, { Schema } from 'mongoose';
import bycrypt from 'bcrypt';
import { NextFunction } from 'express';

const UserSchema: Schema = new Schema({
    pseudo: {
        type: String,
        min: 4,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    boards: {
        type: [String],
    },
    picture: {
        type: String,
        default: 'defaultUserPicture.png',
    },
    notifications: [
        {
            type: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            message: {
                type: String,
            },
            sender: {
                type: String,
            },
            receiver: {
                type: String,
            },
            boardIDRequested: {
                type: String,
            },
        },
    ],
});

UserSchema.pre('save', function (this: any, next) {
    if (!this.picture) this.picture = 'defaultUserPicture.png';

    const salt = 10;
    bycrypt.hash(this.password, salt, (err, hash) => {
        if (err) return console.log('password hash error : ' + err.message);
        this.password = hash;
        next();
    });
});

export default mongoose.model('users', UserSchema);
