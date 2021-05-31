"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const BoardSchema = new mongoose_2.Schema({
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
}, { timestamps: true });
BoardSchema.pre('save', function (next) {
    if (!this.picture)
        this.picture = 'defaultBoardPicture.png';
    next();
});
// export IBoard;
exports.default = mongoose_1.default.model('board', BoardSchema);
