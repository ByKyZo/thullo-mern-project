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
const list_controller_1 = __importDefault(require("./list.controller"));
class BoardController {
    static GetUsersByID(usersID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.find({ _id: { $in: usersID } }).select('pseudo picture');
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, isPrivate, owner } = req.body;
            const boardPicture = req.file;
            try {
                if (!name)
                    throw Error('MISSING_NAME : Missing board name');
                if (name.length > 20)
                    throw Error('NAME_MAX_LENGTH : Name must be 20 characters maximum');
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
                const errors = ErrorManager_1.default.checkErrors(['MAX_SIZE', 'INVALID_TYPE', 'MISSING_NAME', 'INVALID_USER_ID', 'NAME_MAX_LENGTH'], err);
                console.log(err);
                res.status(500).send(errors);
            }
        });
    }
    static getAllBoardsByUserID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = req.params.id;
            const userBoards = utils_1.default.toObject(yield user_model_1.default.findById(userID).select('boards -_id'));
            const boards = yield utils_1.default.toObject(yield board_models_1.default.find({ _id: { $in: userBoards.boards } }));
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
                const userToken = req.cookies.token;
                if (!userToken)
                    throw Error('NO_TOKEN : Error token unknown');
                const id = req.params.id;
                if (!mongoose_1.isValidObjectId(id))
                    throw Error('INVALID_ID : Board id invalid');
                const userID = yield (yield utils_1.default.checkToken(userToken)).userID;
                board_models_1.default.findById(id, (err, docs) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (utils_1.default.isEmpty(docs))
                            throw Error('BOARD_UNKNOWN : Error board unknown');
                        const board = yield docs.toObject();
                        if (board.isPrivate) {
                            if (!board.members.includes(userID))
                                throw Error('PRIVATE_BOARD : Error board is private');
                        }
                        const members = yield user_model_1.default.find({
                            _id: { $in: board.members },
                        }).select('picture pseudo');
                        if (!board.members.includes(userID))
                            board.NOT_MEMBER = true;
                        // TRANSFORM USER ID BY REAL USER
                        for (let i = 0; i < board.lists.length; i++) {
                            for (let j = 0; j < board.lists[i].cards.length; j++) {
                                const cardMembers = yield BoardController.GetUsersByID(board.lists[i].cards[j].members);
                                board.lists[i].cards[j].members = cardMembers;
                            }
                        }
                        board.members = members;
                        board.owner = (yield user_model_1.default.findById(board.owner));
                        res.status(200).send(board);
                    }
                    catch (err) {
                        const errors = ErrorManager_1.default.checkErrors(['BOARD_UNKNOWN', 'PRIVATE_BOARD'], err);
                        console.log(errors);
                        res.sendStatus(500);
                    }
                }));
            }
            catch (err) {
                const errors = ErrorManager_1.default.checkErrors(['BOARD_UNKNOWN', 'INVALID_ID'], err);
                console.log(errors);
                res.sendStatus(500);
            }
        });
    }
    static sendBoardInvitation(senderPseudo, guestUserIDList, boardID, boardName) {
        return __awaiter(this, void 0, void 0, function* () {
            let invitations = [];
            for (let i = 0; i < guestUserIDList.length; i++) {
                const invitation = yield user_model_1.default.findByIdAndUpdate(guestUserIDList[i], {
                    $push: {
                        notifications: {
                            type: 'BOARD_INVATION',
                            title: 'Board Invitation',
                            message: `${senderPseudo} vous invite dans le board ${boardName}`,
                            boardIDRequested: boardID,
                        },
                    },
                }, { new: true }).select('pseudo notifications');
                invitations.push(yield utils_1.default.toObject(invitation));
            }
            yield board_models_1.default.findByIdAndUpdate(boardID, {
                $push: { usersWaiting: guestUserIDList }, // essayer addToSet
            });
            invitations.forEach((invit) => __awaiter(this, void 0, void 0, function* () {
                invit.notifications = yield invit.notifications[invit.notifications.length - 1];
            }));
            return invitations;
        });
    }
    static joinBoard(userID, boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = utils_1.default.toObject(yield user_model_1.default.findByIdAndUpdate(userID, {
                $addToSet: { boards: boardID },
            }).select('pseudo picture'));
            const board = yield utils_1.default.toObject(yield board_models_1.default.findByIdAndUpdate(boardID, {
                $addToSet: { members: userID },
                $pull: { usersWaiting: userID },
            }, { new: true }));
            for (let i = 0; i < board.members.length; i++) {
                const boardMembers = utils_1.default.toObject(yield user_model_1.default.findOne({ _id: { $in: board.members[i] } }).select('pseudo _id picture'));
                board.members[i] = yield boardMembers;
            }
            return { user, board };
        });
    }
    static changeState(boardID, state) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield board_models_1.default.findByIdAndUpdate(boardID, { $set: { isPrivate: state } });
        });
    }
    static banMember(boardID, memberBannedID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_model_1.default.findByIdAndUpdate(memberBannedID, { $pull: { boards: boardID } });
            yield board_models_1.default.findByIdAndUpdate(boardID, { $pull: { members: memberBannedID } });
        });
    }
    static changeDescription(description, boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default.findByIdAndUpdate(boardID, { $set: { description: description } });
        });
    }
    static leaveBoard(userID, boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default.findByIdAndUpdate(boardID, { $pull: { members: userID } });
            yield user_model_1.default.findByIdAndUpdate(userID, { $pull: { boards: boardID } });
        });
    }
    static deleteBoard(boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(boardID);
            yield board_models_1.default.findByIdAndRemove(boardID);
        });
    }
    static getAvailableAssignedMembers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const boardID = req.params.id;
            const { cardID, listID } = req.body;
            const board = yield utils_1.default.toObject(yield board_models_1.default.findById(boardID));
            const card = yield list_controller_1.default.getCardFromDB(boardID, listID, cardID);
            if (!card)
                return console.log('getAvailableAssignedMembers() CARD NULL');
            const boardMembers = board.members;
            const members = yield BoardController.GetUsersByID(boardMembers);
            res.status(200).send(members);
        });
    }
}
exports.default = BoardController;
