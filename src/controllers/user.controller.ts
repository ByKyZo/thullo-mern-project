import { Request, Response } from 'express';
import { MongooseDocument, isValidObjectId } from 'mongoose';
import UserModel from '../models/user.model';
import bycrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import ErrorManager from '../utils/ErrorManager';
import BoardModels from '../models/board.models';
import Utils from '../utils/utils';

export class UserController {
    private static async createJwtToken(userID: String) {
        const maxAge = 3 * 24 * 60 * 60 * 1000;
        const token: Secret = process.env.SECRET_TOKEN as Secret;
        return jwt.sign({ userID }, token, {
            expiresIn: maxAge,
        });
    }

    public static async register(req: Request, res: Response) {
        const { pseudo, email, password } = req.body;

        try {
            const isEmailExist = await UserModel.findOne({ email });

            if (isEmailExist) throw Error('EMAIL_ALREADY_EXIST : Email already exists');

            await UserModel.create({ pseudo, email, password });

            res.sendStatus(200);
        } catch (err) {
            const errors = ErrorManager.checkErrors(['EMAIL_ALREADY_EXIST'], err);
            return res.status(500).send(errors);
        }
    }

    public static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        console.log('LOGIN');
        UserModel.findOne({ email }, async (err: any, docs: MongooseDocument) => {
            try {
                if (err || !docs || !email || !password)
                    throw Error('INVALID_INFORMATION : Invalid informations');
                const user = await docs.toObject();
                const passwordHash = user.password;
                delete user.password;
                bycrypt.compare(password, passwordHash, async (err, same) => {
                    try {
                        if (err) console.log('Compare password Error : ' + err.message);

                        if (!same || err) throw Error('INVALID_INFORMATION : Invalid informations');

                        const jwtToken = await UserController.createJwtToken(user._id);
                        res.send({ user, token: jwtToken });
                    } catch (err) {
                        const errors = ErrorManager.checkErrors(['INVALID_INFORMATION'], err);
                        res.status(500).send(errors);
                    }
                });
            } catch (err) {
                const errors = ErrorManager.checkErrors(['INVALID_INFORMATION'], err);
                res.status(500).send(errors);
            }
        });
    }

    public static rememberMe(req: Request, res: Response) {
        if (!req.cookies.token) return res.status(500).send('NO_COOKIE');

        const token = req.cookies.token;

        jwt.verify(token, process.env.SECRET_TOKEN as Secret, async (err: any) => {
            if (err) {
                res.status(500).send({ message: 'INVALID_TOKEN' });
                return console.log('Token verify error : ' + err);
            }
            const tokenDecoded = await jwt.decode(token, { complete: true });
            if (!tokenDecoded) return res.status(500).send('WRONG_TOKEN');
            const userID = tokenDecoded.payload.userID;
            const user = await UserModel.findById(userID).select('-password');
            const jwtToken = await UserController.createJwtToken(userID);
            res.status(200).send({ user, token: jwtToken });
        });
    }

    public static getUser(req: Request, res: Response) {
        res.send('Hello from getUser');
    }

    public static async getUsersByNotMatchBoardID(req: Request, res: Response) {
        const boardID = req.params.id;

        const board = await Utils.toObject(await BoardModels.findById(boardID));

        const userMembersOrWaiting = board.members.concat(board.usersWaiting);

        const users = await UserModel.find({
            _id: { $nin: userMembersOrWaiting },
        }).select('pseudo picture');

        res.status(200).send(users);
    }

    public static async sendNotification(req: Request, res: Response) {
        const { userID, type, title, message } = req.body;
    }

    public static async deleteNotification(req: Request, res: Response) {
        const { userID, notificationID, boardIDRequested } = req.body;

        const user = await UserModel.findByIdAndUpdate(userID, {
            $pull: { notifications: { _id: notificationID } },
        });

        if (isValidObjectId(boardIDRequested) && boardIDRequested) {
            await BoardModels.findByIdAndUpdate(boardIDRequested, {
                $pull: { usersWaiting: userID },
            });
        }
        res.status(200).send(user);
    }

    public static delete(req: Request, res: Response) {
        res.send('Hello from Delete');
    }

    public static update(req: Request, res: Response) {
        res.send('Hello from Update');
    }
}
