import boardModels from '../models/board.models';
import Utils from '../utils/utils';
import { IBoard, ICard } from '../models/board.models';
import { Response, Request } from 'express';
import { MongooseDocument } from 'mongoose';
import BoardController from './board.controller';
import { IUser } from '../models/user.model';
import FileManager from '../utils/FileManager';
import path from 'path';

export default class ListController {
    public static async getCardFromDB(
        boardID: string,
        listID: string,
        cardID: string
    ): Promise<ICard> {
        const board: IBoard = await Utils.toObject(await boardModels.findById(boardID));

        const currentListIndex: number = board.lists.findIndex((list) => list._id === listID);

        if (currentListIndex === -1) console.log('getCardFromDB() LIST INDEX NULL');

        const cardIndex = board.lists[currentListIndex].cards.findIndex(
            (card) => card._id === cardID
        );

        if (cardIndex === -1) console.log('getCardFromDB() CARD INDEX NULL');

        return board?.lists[currentListIndex].cards[cardIndex];
    }

    public static async addList(name: string, boardID: string) {
        const board = await boardModels
            .findByIdAndUpdate(boardID, { $push: { lists: { name } } }, { new: true })
            .select('lists -_id');

        return board?.lists[board.lists.length - 1];
    }

    public static async addCard(name: string, boardID: string, listID: string) {
        await boardModels
            .updateOne(
                { _id: boardID, lists: { $elemMatch: { _id: listID } } },
                { $push: { 'lists.$.cards': { title: name } } }
            )
            .select('lists -_id');
        const board: IBoard = await Utils.toObject(
            await boardModels.findById(boardID).select('lists -_id')
        );
        const listIndex: number | undefined = board?.lists.findIndex((list) => list._id === listID);
        if (listIndex === -1) return console.log('ADD CARD INDEX ERROR');
        return board?.lists[listIndex].cards[board?.lists[listIndex].cards.length - 1];
    }

    public static async renameList(rename: string, listID: string, boardID: string) {
        await boardModels.findOneAndUpdate(
            { _id: boardID, lists: { $elemMatch: { _id: listID } } },
            { $set: { 'lists.$.name': rename } }
        );
        console.log('RENAME LIST');
        console.log(rename);
        console.log(listID);
        console.log(boardID);
    }

    public static async deleteList(listID: string, boardID: string) {
        const board = await boardModels.findByIdAndUpdate(boardID, {
            $pull: { lists: { _id: listID } },
        });
    }

    public static async reorderList(listsReorder: Array<any>, boardID: string) {
        const board = await boardModels.findByIdAndUpdate(boardID, {
            $set: { lists: listsReorder },
        });
    }

    public static async getCard(req: Request, res: Response) {
        const cardID = req.params.id;
        const { boardID, listID } = req.body;

        const card: ICard = await Utils.toObject(
            await ListController.getCardFromDB(boardID, listID, cardID)
        );

        const assignedMember = await BoardController.GetUsersByID(card.members);

        const commentsUsersID: string[] = await card.comments.map((comment) => comment.userID);
        const commentsUsers: IUser[] = await BoardController.GetUsersByID(commentsUsersID);

        for (let i = 0; i < card.comments.length; i++) {
            card.comments[i].user = await commentsUsers[i];
        }

        card.members = assignedMember;

        res.status(200).send(card);
    }

    public static async assignMember(
        assignedMembersID: string[],
        boardID: string,
        listID: string,
        cardID: string
    ): Promise<IUser[]> {
        // console.log(assignedMembersID);
        const board = await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            { $set: { 'lists.$.cards.$[inner].members': assignedMembersID } },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );

        return await BoardController.GetUsersByID(assignedMembersID);
    }

    public static async changeCardTitle(
        boardID: string,
        listID: string,
        cardID: string,
        cardTitle: string
    ) {
        const board = await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            { $set: { 'lists.$.cards.$[inner].title': cardTitle } },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );
    }

    public static async changeCardDescription(
        boardID: string,
        listID: string,
        cardID: string,
        description: string
    ) {
        const board = await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            { $set: { 'lists.$.cards.$[inner].description': description } },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );
    }
    public static async addAttachment(req: Request, res: Response) {
        let attachment: any = req.file;
        const { boardID, listID, cardID } = req.body;
        const attachmentPath = await FileManager.uploadFile(`board-${boardID}-`, attachment);

        await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            {
                $push: {
                    'lists.$.cards.$[inner].attachments': {
                        name: attachment.originalName,
                        filePath: attachmentPath,
                        createdAt: Date.now(),
                    },
                },
            },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );
        const card = await ListController.getCardFromDB(boardID, listID, cardID);
        // card.at
        res.status(200).send(card.attachments[card.attachments.length - 1]);
    }

    public static async downloadAttachment(req: Request, res: Response) {
        const { filePath } = req.body;
        const attachmentFullPath = path.join(__dirname, '..', 'assets', 'attachments', filePath);
        res.download(attachmentFullPath);
    }
    public static async deleteAttachment(
        boardID: string,
        listID: string,
        cardID: string,
        attachmentID: string
    ) {
        await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            {
                $pull: {
                    'lists.$.cards.$[inner].attachments': {
                        _id: attachmentID,
                    },
                },
            },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );
    }

    public static async sendComment(
        boardID: string,
        listID: string,
        cardID: string,
        userID: string,
        message: string
    ) {
        await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            {
                $push: {
                    'lists.$.cards.$[inner].comments': {
                        userID,
                        message,
                        createdAt: Date.now(),
                    },
                },
            },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );
        const card = await ListController.getCardFromDB(boardID, listID, cardID);

        const cardUser = await BoardController.GetUsersByID([userID]);

        const comments = card.comments[card.comments.length - 1];

        comments.user = cardUser[0];

        return comments;
    }

    public static async deleteComment(
        boardID: string,
        listID: string,
        cardID: string,
        commentID: string
    ) {
        await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            {
                $pull: {
                    'lists.$.cards.$[inner].comments': {
                        _id: commentID,
                    },
                },
            },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );
    }

    public static async editComment(
        boardID: string,
        listID: string,
        cardID: string,
        commentID: string,
        message: string
    ) {
        await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            {
                $set: {
                    'lists.$.cards.$[inner].comments.$[innerComment].message': message,
                },
            },
            {
                arrayFilters: [{ 'inner._id': cardID }, { 'innerComment._id': commentID }],
            }
        );
    }

    public static async addLabel(
        boardID: string,
        listID: string,
        cardID: string,
        labelName: string,
        color: string
    ) {
        await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            {
                $push: {
                    'lists.$.cards.$[inner].labels': { name: labelName, color },
                },
            },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );

        const card = await ListController.getCardFromDB(boardID, listID, cardID);

        return card.labels[card.labels.length - 1];
    }
    public static async deleteLabel(
        boardID: string,
        listID: string,
        cardID: string,
        labelID: string
    ) {
        console.log(labelID);

        await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            {
                $pull: {
                    'lists.$.cards.$[inner].labels': { _id: labelID },
                },
            },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );

        const card = await ListController.getCardFromDB(boardID, listID, cardID);

        return card.labels[card.labels.length - 1];
    }

    public static async changeCardPicture(
        boardID: string,
        listID: string,
        cardID: string,
        picture: string
    ) {
        console.log(picture);

        await boardModels.updateOne(
            {
                _id: boardID,
                lists: { $elemMatch: { _id: listID } },
            },
            {
                $set: {
                    'lists.$.cards.$[inner]': { picture: picture },
                },
            },
            {
                arrayFilters: [{ 'inner._id': cardID }],
            }
        );
    }
}
