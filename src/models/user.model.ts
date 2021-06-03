import mongoose, { Schema } from 'mongoose';
import bycrypt from 'bcrypt';

export interface IUser extends mongoose.Document {
    pseudo: string;
    email: string;
    password: string;
    boards: [string];
    picture: string;
    notifications: [
        {
            type: string;
            title: string;
            message: string;
            sender: string;
            receiver: string;
            boardIDRequested: String;
        }
    ];
    createdAt: Date;
    modifiedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
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
    },
    { timestamps: true }
);

UserSchema.pre('save', function (this: any, next) {
    if (!this.picture) this.picture = 'defaultUserPicture.png';

    const salt = 10;
    bycrypt.hash(this.password, salt, (err, hash) => {
        if (err) return console.log('password hash error : ' + err.message);
        this.password = hash;
        next();
    });
});

export default mongoose.model<IUser>('users', UserSchema);
