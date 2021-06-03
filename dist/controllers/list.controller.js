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
const board_models_1 = __importDefault(require("../models/board.models"));
const utils_1 = __importDefault(require("../utils/utils"));
const board_controller_1 = __importDefault(require("./board.controller"));
const FileManager_1 = __importDefault(require("../utils/FileManager"));
const path_1 = __importDefault(require("path"));
class ListController {
    static getCardFromDB(boardID, listID, cardID) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield utils_1.default.toObject(yield board_models_1.default.findById(boardID));
            const currentListIndex = board.lists.findIndex((list) => list._id === listID);
            if (currentListIndex === -1)
                console.log('getCardFromDB() LIST INDEX NULL');
            const cardIndex = board.lists[currentListIndex].cards.findIndex((card) => card._id === cardID);
            if (cardIndex === -1)
                console.log('getCardFromDB() CARD INDEX NULL');
            return board === null || board === void 0 ? void 0 : board.lists[currentListIndex].cards[cardIndex];
        });
    }
    static addList(name, boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield board_models_1.default
                .findByIdAndUpdate(boardID, { $push: { lists: { name } } }, { new: true })
                .select('lists -_id');
            return board === null || board === void 0 ? void 0 : board.lists[board.lists.length - 1];
        });
    }
    static addCard(name, boardID, listID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default
                .updateOne({ _id: boardID, lists: { $elemMatch: { _id: listID } } }, { $push: { 'lists.$.cards': { title: name } } })
                .select('lists -_id');
            const board = yield utils_1.default.toObject(yield board_models_1.default.findById(boardID).select('lists -_id'));
            const listIndex = board === null || board === void 0 ? void 0 : board.lists.findIndex((list) => list._id === listID);
            if (listIndex === -1)
                return console.log('ADD CARD INDEX ERROR');
            return board === null || board === void 0 ? void 0 : board.lists[listIndex].cards[(board === null || board === void 0 ? void 0 : board.lists[listIndex].cards.length) - 1];
        });
    }
    static renameList(rename, listID, boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default.findOneAndUpdate({ _id: boardID, lists: { $elemMatch: { _id: listID } } }, { $set: { 'lists.$.name': rename } });
            console.log('RENAME LIST');
            console.log(rename);
            console.log(listID);
            console.log(boardID);
        });
    }
    static deleteList(listID, boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield board_models_1.default.findByIdAndUpdate(boardID, {
                $pull: { lists: { _id: listID } },
            });
        });
    }
    static reorderList(listsReorder, boardID) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield board_models_1.default.findByIdAndUpdate(boardID, {
                $set: { lists: listsReorder },
            });
        });
    }
    static getCard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cardID = req.params.id;
            const { boardID, listID } = req.body;
            const card = yield utils_1.default.toObject(yield ListController.getCardFromDB(boardID, listID, cardID));
            const assignedMember = yield board_controller_1.default.GetUsersByID(card.members);
            const commentsUsersID = yield card.comments.map((comment) => comment.userID);
            const commentsUsers = yield board_controller_1.default.GetUsersByID(commentsUsersID);
            for (let i = 0; i < card.comments.length; i++) {
                card.comments[i].user = yield commentsUsers[i];
            }
            card.members = assignedMember;
            res.status(200).send(card);
        });
    }
    static assignMember(assignedMembersID, boardID, listID, cardID) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(assignedMembersID);
            const board = yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, { $set: { 'lists.$.cards.$[inner].members': assignedMembersID } }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
            return yield board_controller_1.default.GetUsersByID(assignedMembersID);
        });
    }
    static changeCardTitle(boardID, listID, cardID, cardTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, { $set: { 'lists.$.cards.$[inner].title': cardTitle } }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
        });
    }
    static changeCardDescription(boardID, listID, cardID, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, { $set: { 'lists.$.cards.$[inner].description': description } }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
        });
    }
    static addAttachment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let attachment = req.file;
            const { boardID, listID, cardID } = req.body;
            const attachmentPath = yield FileManager_1.default.uploadFile(`board-${boardID}-`, attachment);
            yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, {
                $push: {
                    'lists.$.cards.$[inner].attachments': {
                        name: attachment.originalName,
                        filePath: attachmentPath,
                        createdAt: Date.now(),
                    },
                },
            }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
            const card = yield ListController.getCardFromDB(boardID, listID, cardID);
            // card.at
            res.status(200).send(card.attachments[card.attachments.length - 1]);
        });
    }
    static downloadAttachment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { filePath } = req.body;
            const attachmentFullPath = path_1.default.join(__dirname, '..', 'assets', 'attachments', filePath);
            res.download(attachmentFullPath);
        });
    }
    static deleteAttachment(boardID, listID, cardID, attachmentID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, {
                $pull: {
                    'lists.$.cards.$[inner].attachments': {
                        _id: attachmentID,
                    },
                },
            }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
        });
    }
    static sendComment(boardID, listID, cardID, userID, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, {
                $push: {
                    'lists.$.cards.$[inner].comments': {
                        userID,
                        message,
                        createdAt: Date.now(),
                    },
                },
            }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
            const card = yield ListController.getCardFromDB(boardID, listID, cardID);
            const cardUser = yield board_controller_1.default.GetUsersByID([userID]);
            const comments = card.comments[card.comments.length - 1];
            comments.user = cardUser[0];
            return comments;
        });
    }
    static deleteComment(boardID, listID, cardID, commentID) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, {
                $pull: {
                    'lists.$.cards.$[inner].comments': {
                        _id: commentID,
                    },
                },
            }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
        });
    }
    static editComment(boardID, listID, cardID, commentID, message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, {
                $set: {
                    'lists.$.cards.$[inner].comments.$[innerComment].message': message,
                },
            }, {
                arrayFilters: [{ 'inner._id': cardID }, { 'innerComment._id': commentID }],
            });
        });
    }
    static addLabel(boardID, listID, cardID, labelName, color) {
        return __awaiter(this, void 0, void 0, function* () {
            yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, {
                $push: {
                    'lists.$.cards.$[inner].labels': { name: labelName, color },
                },
            }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
            const card = yield ListController.getCardFromDB(boardID, listID, cardID);
            return card.labels[card.labels.length - 1];
        });
    }
    static deleteLabel(boardID, listID, cardID, labelID) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(labelID);
            yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, {
                $pull: {
                    'lists.$.cards.$[inner].labels': { _id: labelID },
                },
            }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
            const card = yield ListController.getCardFromDB(boardID, listID, cardID);
            return card.labels[card.labels.length - 1];
        });
    }
    static changeCardPicture(boardID, listID, cardID, picture) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(picture);
            yield board_models_1.default.updateOne({
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            }, {
                $set: {
                    'lists.$.cards.$[inner].picture': picture,
                },
            }, {
                arrayFilters: [{ 'inner._id': cardID }],
            });
        });
    }
}
exports.default = ListController;
