import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { convertToObject } from 'typescript';
import BoardModel from '../models/board.models';
import UserModel from '../models/user.model';
import ErrorManager from '../utils/ErrorManager';
import FileManager from '../utils/FileManager';
import Utils from '../utils/utils';

export default class BoardController {
    public static async create(req: Request, res: Response) {
        const { name, isPrivate, owner } = req.body;
        const boardPicture = req.file;
        try {
            if (!name) throw Error('MISSING_NAME : Missing board name');
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
                ['MAX_SIZE', 'INVALID_TYPE', 'MISSING_NAME', 'INVALID_USER_ID'],
                err
            );
            console.log(err);
            res.status(500).send(errors);
        }
    }
    public static async getAllBoardsByUserID(req: Request, res: Response) {
        const userID = req.params.id;

        const userBoards = Utils.toObject(await UserModel.findById(userID).select('boards -_id'));

        const boards = Utils.toObject(await BoardModel.find({ _id: { $in: userBoards.boards } }));

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
            const id = req.params.id;
            const board = Utils.toObject(await BoardModel.findById(id));

            if (!board) throw Error('BOARD_UNKNOW : Error board unknow');

            const members = await UserModel.find({ _id: { $in: board.members } }).select(
                'picture pseudo'
            );

            board.members = members;

            res.status(200).send(board);
        } catch (err) {
            const errors = ErrorManager.checkErrors(['BOARD_UNKNOW'], err);
            res.status(500).send(errors);
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
                    $addToSet: {
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

        invitations.forEach(async (invit) => {
            invit.notifications = await invit.notifications[invit.notifications.length - 1];
        });

        return invitations;
    }

    public static async joinBoard(userID: string, boardID: string) {
        // console.log(boardID);
        const user = await UserModel.findByIdAndUpdate(userID, {
            $addToSet: { boards: boardID },
        }).select('pseudo picture');
        const board = await Utils.toObject(
            await BoardModel.findByIdAndUpdate(
                boardID,
                {
                    $addToSet: { members: userID },
                },
                { new: true }
            )
        );

        // for (let i = 0; i < board.length; i++) {
        //     const boardMembers = await UserModel.find({ _id: { $in: board[i].members } }).select(
        //         'pseudo _id picture'
        //     );
        //     board[i].members = await boardMembers;
        // }
        // console.log(board);
        return { user, board };
    }
}
