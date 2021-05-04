import mongoose, { Schema } from 'mongoose';

const UserSchema: Schema = new Schema(
    {
        pseudo: {
            type: String,
            min: 4,
            required: true
        },
        email: {
            type: String,
            lowercase: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        }
    }
)

export default mongoose.model('users', UserSchema);