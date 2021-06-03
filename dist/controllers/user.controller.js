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
exports.UserController = void 0;
const mongoose_1 = require("mongoose");
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorManager_1 = __importDefault(require("../utils/ErrorManager"));
const board_models_1 = __importDefault(require("../models/board.models"));
const utils_1 = __importDefault(require("../utils/utils"));
class UserController {
    static createJwtToken(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxAge = 3 * 24 * 60 * 60 * 1000;
            const token = process.env.SECRET_TOKEN;
            return jsonwebtoken_1.default.sign({ userID }, token, {
                expiresIn: maxAge,
            });
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pseudo, email, password } = req.body;
            try {
                const isEmailExist = yield user_model_1.default.findOne({ email });
                if (isEmailExist)
                    throw Error('EMAIL_ALREADY_EXIST : Email already exists');
                yield user_model_1.default.create({ pseudo, email, password });
                res.sendStatus(200);
            }
            catch (err) {
                const errors = ErrorManager_1.default.checkErrors(['EMAIL_ALREADY_EXIST'], err);
                return res.status(500).send(errors);
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            console.log('LOGIN');
            user_model_1.default.findOne({ email }, (err, docs) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (err || !docs || !email || !password)
                        throw Error('INVALID_INFORMATION : Invalid informations');
                    const user = yield docs.toObject();
                    const passwordHash = user.password;
                    delete user.password;
                    bcrypt_1.default.compare(password, passwordHash, (err, same) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            if (err)
                                console.log('Compare password Error : ' + err.message);
                            if (!same || err)
                                throw Error('INVALID_INFORMATION : Invalid informations');
                            const jwtToken = yield UserController.createJwtToken(user._id);
                            res.send({ user, token: jwtToken });
                        }
                        catch (err) {
                            const errors = ErrorManager_1.default.checkErrors(['INVALID_INFORMATION'], err);
                            res.status(500).send(errors);
                        }
                    }));
                }
                catch (err) {
                    const errors = ErrorManager_1.default.checkErrors(['INVALID_INFORMATION'], err);
                    res.status(500).send(errors);
                }
            }));
        });
    }
    static rememberMe(req, res) {
        if (!req.cookies.token)
            return res.status(500).send('NO_COOKIE');
        const token = req.cookies.token;
        jsonwebtoken_1.default.verify(token, process.env.SECRET_TOKEN, (err) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.status(500).send({ message: 'INVALID_TOKEN' });
                return console.log('Token verify error : ' + err);
            }
            const tokenDecoded = yield jsonwebtoken_1.default.decode(token, { complete: true });
            if (!tokenDecoded)
                return res.status(500).send('WRONG_TOKEN');
            const userID = tokenDecoded.payload.userID;
            const user = yield user_model_1.default.findById(userID).select('-password');
            const jwtToken = yield UserController.createJwtToken(userID);
            res.status(200).send({ user, token: jwtToken });
        }));
    }
    static getUser(req, res) {
        res.send('Hello from getUser');
    }
    static getUsersByNotMatchBoardID(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const boardID = req.params.id;
            const board = yield utils_1.default.toObject(yield board_models_1.default.findById(boardID));
            const userMembersOrWaiting = board.members.concat(board.usersWaiting);
            const users = yield user_model_1.default.find({
                _id: { $nin: userMembersOrWaiting },
            }).select('pseudo picture');
            res.status(200).send(users);
        });
    }
    static sendNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID, type, title, message } = req.body;
        });
    }
    static deleteNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userID, notificationID, boardIDRequested } = req.body;
            const user = yield user_model_1.default.findByIdAndUpdate(userID, {
                $pull: { notifications: { _id: notificationID } },
            });
            if (mongoose_1.isValidObjectId(boardIDRequested) && boardIDRequested) {
                yield board_models_1.default.findByIdAndUpdate(boardIDRequested, {
                    $pull: { usersWaiting: userID },
                });
            }
            res.status(200).send(user);
        });
    }
    static delete(req, res) {
        res.send('Hello from Delete');
    }
    static update(req, res) {
        res.send('Hello from Update');
    }
}
exports.UserController = UserController;
