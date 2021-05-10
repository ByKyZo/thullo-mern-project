"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const board_models_1 = __importDefault(require("../models/board.models"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorManager_1 = __importDefault(require("../utils/ErrorManager"));
const FileManager_1 = __importDefault(require("../utils/FileManager"));
const utils_1 = __importDefault(require("../utils/utils"));
class BoardController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, isPrivate, owner } = req.body;
            const boardPicture = req.file;
            try {
                if (!name)
                    throw Error('MISSING_NAME : Missing board name');
                if (!mongoose_1.isValidObjectId(owner))
                    throw Error('INVALID_USER_ID : Error retry please');
                let pictureName = '';
                if (boardPicture) {
                    pictureName = yield FileManager_1.default.uploadPicture(name, 'board-picture', boardPicture);
                }
                const ownerDetails = yield utils_1.default.toObject(yield user_model_1.default.findById(owner).select('pseudo picture').exec());
                const board = yield utils_1.default.toObject(yield board_models_1.default.create({
                    name,
                    isPrivate,
                    owner,
                    picture: pictureName,
                    members: owner,
                }));
                // replace id by owner details
                board.members[0] = yield ownerDetails;
                yield user_model_1.default.findByIdAndUpdate(board.owner, { $addToSet: { boards: board._id } });
                res.status(200).send(board);
            }
            catch (err) {
                const errors = ErrorManager_1.default.checkErrors(['MAX_SIZE', 'INVALID_TYPE', 'MISSING_NAME', 'INVALID_USER_ID'], err);
                console.log(err);
                res.status(500).send(errors);
            }
        });
    }
    static getAllBoardsByUserID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.params.id;
            const userBoards = utils_1.default.toObject(yield user_model_1.default.findById(userID).select('boards -_id'));
            const boards = utils_1.default.toObject(yield board_models_1.default.find({ _id: { $in: userBoards.boards } }));
            for (let i = 0; i < boards.length; i++) {
                const boardMembers = yield user_model_1.default.find({ _id: { $in: boards[i].members } }).select('pseudo _id picture');
                boards[i].members = yield boardMembers;
            }
            res.status(200).send(boards);
        });
    }
    static getBoard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const board = utils_1.default.toObject(yield board_models_1.default.findById(id));
                if (!board)
                    throw Error('BOARD_UNKNOW : Error board unknow');
                const members = yield user_model_1.default.find({ _id: { $in: board.members } }).select('picture pseudo');
                board.members = members;
                res.status(200).send(board);
            }
            catch (err) {
                const errors = ErrorManager_1.default.checkErrors(['BOARD_UNKNOW'], err);
                res.status(500).send(errors);
            }
        });
    }
    static sendBoardInvitation(guestUserIDList, boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            let invitations = [];
            for (let i = 0; i < guestUserIDList.length; i++) {
                const invitation = yield user_model_1.default.findByIdAndUpdate(guestUserIDList[i], {
                    $addToSet: {
                        notifications: { title: 'Board invitation', content: boardID },
                    },
                }, { new: true }).select('pseudo notifications');
                invitations.push(yield utils_1.default.toObject(invitation));
            }
            invitations.forEach((invit) => __awaiter(this, void 0, void 0, function* () {
                invit.notifications = yield invit.notifications[invit.notifications.length - 1];
            }));
            return invitations;
        });
    }
}
exports.default = BoardController;
