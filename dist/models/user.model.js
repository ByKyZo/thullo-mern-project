"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.Schema({
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
UserSchema.pre('save', function (next) {
    if (!this.picture)
        this.picture = 'defaultUserPicture.png';
    const salt = 10;
    bcrypt_1.default.hash(this.password, salt, (err, hash) => {
        if (err)
            return console.log('password hash error : ' + err.message);
        this.password = hash;
        next();
    });
});
exports.default = mongoose_1.default.model('users', UserSchema);
