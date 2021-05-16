import { Request, Response } from 'express';
import { isValidObjectId, MongooseDocument } from 'mongoose';
import { convertToObject } from 'typescript';
import BoardModel from '../models/board.models';
import UserModel from '../models/user.model';
import ErrorManager from '../utils/ErrorManager';
import FileManager from '../utils/FileManager';
import Utils from '../utils/utils';
import { IBoard } from '../models/board.models';
import { IUser } from '../models/user.model';

// interface Board {

// }

export default class BoardController {
    public static async create(req: Request, res: Response) {
        const { name, isPrivate, owner } = req.body;
        const boardPicture = req.file;
        try {
            if (!name) throw Error('MISSING_NAME : Missing board name');
            if (name.length > 20)
                throw Error('NAME_MAX_LENGTH : Name must be 20 characters maximum');
            if (!isValidObjectId(owner)) throw Error('INVALID_USER_ID : Error retry please');

            let pictureName: string = '';

            if (boardPicture) {
                pictureName = await FileManager.uploadPicture(name, 'board-picture', boardPicture);
            }

            const ownerDetails = await Utils.toObject(
                await UserModel.findById(owner).select('pseudo picture').exec()
            );

            const board = await Utils.toObject(
                await BoardModel.create({
                    name,
                    isPrivate,
                    owner,
                    picture: pictureName,
                    members: owner,
                })
            );
            // replace id by owner details
            board.members[0] = await ownerDetails;

            await UserModel.findByIdAndUpdate(board.owner, { $addToSet: { boards: board._id } });

            res.status(200).send(board);
        } catch (err) {
            const errors = ErrorManager.checkErrors(
                ['MAX_SIZE', 'INVALID_TYPE', 'MISSING_NAME', 'INVALID_USER_ID', 'NAME_MAX_LENGTH'],
                err
            );
            console.log(err);
            res.status(500).send(errors);
        }
    }
    public static async getAllBoardsByUserID(req: Request, res: Response) {
        const userID = req.params.id;

        const userBoards = Utils.toObject(await UserModel.findById(userID).select('boards -_id'));

        const boards: Array<any> = await Utils.toObject(
            await BoardModel.find({ _id: { $in: userBoards.boards } })
        );

        for (let i = 0; i < boards.length; i++) {
            const boardMembers = await UserModel.find({ _id: { $in: boards[i].members } }).select(
                'pseudo _id picture'
            );
            boards[i].members = await boardMembers;
        }

        res.status(200).send(boards);
    }
    public static async getBoard(req: Request, res: Response) {
        try {
            const userToken: string = req.cookies.token;
            if (!userToken) throw Error('NO_TOKEN : Error token unknown');
            const id = req.params.id;
            if (!isValidObjectId(id)) throw Error('INVALID_ID : Board id invalid');
            const userID: object = await (await Utils.checkToken(userToken)).userID;

            BoardModel.findById(id, async (err: any, docs: MongooseDocument) => {
                try {
                    if (Utils.isEmpty(docs)) throw Error('BOARD_UNKNOWN : Error board unknown');
                    const board = await docs.toObject();

                    if (board.isPrivate) {
                        if (!board.members.includes(userID))
                            throw Error('PRIVATE_BOARD : Error board is private');
                    }
                    const members = await UserModel.find({
                        _id: { $in: board.members },
                    }).select('picture pseudo');

                    if (!board.members.includes(userID)) board.NOT_MEMBER = true;
                    board.members = members;

                    board.owner = await UserModel.findById(board.owner).select('picture pseudo');

                    res.status(200).send(board);
                } catch (err) {
                    const errors = ErrorManager.checkErrors(
                        ['BOARD_UNKNOWN', 'PRIVATE_BOARD'],
                        err
                    );
                    console.log(errors);
                    res.sendStatus(500);
                }
            });
        } catch (err) {
            const errors = ErrorManager.checkErrors(['BOARD_UNKNOWN', 'INVALID_ID'], err);
            console.log(errors);
            res.sendStatus(500);
        }
    }

    public static async sendBoardInvitation(
        senderPseudo: string,
        guestUserIDList: [string],
        boardID: string,
        boardName: string
    ) {
        let invitations = [];

        for (let i = 0; i < guestUserIDList.length; i++) {
            const invitation = await UserModel.findByIdAndUpdate(
                guestUserIDList[i],
                {
                    $push: {
                        notifications: {
                            type: 'BOARD_INVATION',
                            title: 'Board Invitation',
                            message: `${senderPseudo} vous invite dans le board ${boardName}`,
                            boardIDRequested: boardID,
                        },
                    },
                },
                { new: true }
            ).select('pseudo notifications');
            invitations.push(await Utils.toObject(invitation));
        }

        await BoardModel.findByIdAndUpdate(boardID, {
            $push: { usersWaiting: guestUserIDList }, // essayer addToSet
        });

        invitations.forEach(async (invit) => {
            invit.notifications = await invit.notifications[invit.notifications.length - 1];
        });

        return invitations;
    }

    public static async joinBoard(userID: string, boardID: string) {
        const user: IUser = Utils.toObject(
            await UserModel.findByIdAndUpdate(userID, {
                $addToSet: { boards: boardID },
            }).select('pseudo picture')
        );
        const board: IBoard = await Utils.toObject(
            await BoardModel.findByIdAndUpdate(
                boardID,
                {
                    $addToSet: { members: userID },
                    $pull: { usersWaiting: userID },
                },
                { new: true }
            )
        );
        for (let i = 0; i < board.members.length; i++) {
            const boardMembers: any = Utils.toObject(
                await UserModel.findOne({ _id: { $in: board.members[i] } }).select(
                    'pseudo _id picture'
                )
            );
            board.members[i] = await boardMembers;
        }

        // console.log(board);
        return { user, board };
    }

    public static async changeState(boardID: string, state: boolean) {
        const board = await BoardModel.findByIdAndUpdate(boardID, { $set: { isPrivate: state } });
    }

    public static async banMember(boardID: string, memberBannedID: string) {
        await UserModel.findByIdAndUpdate(memberBannedID, { $pull: { boards: boardID } });
        await BoardModel.findByIdAndUpdate(boardID, { $pull: { members: memberBannedID } });
    }

    public static async changeDescription(description: string, boardID: string) {
        console.log(description);
        console.log(boardID);
        const MAX_LENGTH = 600;

        if (description.length > MAX_LENGTH) return;
        await BoardModel.findByIdAndUpdate(boardID, { $set: { description: description } });
    }
}
