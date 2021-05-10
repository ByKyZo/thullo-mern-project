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
});
BoardSchema.pre('save', function (next) {
    if (!this.picture)
        this.picture = 'defaultBoardPicture.png';
    next();
});
exports.default = mongoose_1.default.model('board', BoardSchema);
