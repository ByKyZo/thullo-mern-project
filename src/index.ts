import express from 'express';
import * as http from 'http';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', 'config', '.env.local') });
import cors from 'cors';
import { CommonRoutesConfig } from './routes/common.routes.config';
import cookieParser from 'cookie-parser';
import UserRoutes from './routes/user.routes';
import BoardRoutes from './routes/board.routes';
import { Server } from 'socket.io';
import './database/database';
import BoardController from './controllers/board.controller';
import ListController from './controllers/list.controller';

// FOR PRODUCTION

// SERVER SIDE
// const ON_PRODUCTION = -> TRUE;

// CLIENT SIDE
// Change API / SOCKET URL in Config.js
// And reBuild React App

// HEROKU SIDE
// SET ENV VARIABLE

const ON_PRODUCTION: boolean = true;

const app: express.Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const ORIGIN = ON_PRODUCTION ? '' : process.env.ORIGIN;

const io = new Server(server, {
    cors: {
        origin: ORIGIN,
        credentials: true,
    },
});

const routes: Array<CommonRoutesConfig> = [];

// FAIRE UNE CLASSE SOCKET PROPREMENT

io.on('connection', (socket) => {
    socket.on('send invitation', async ({ senderPseudo, guestUserIDList, boardID, boardName }) => {
        const invitations = await BoardController.sendBoardInvitation(
            senderPseudo,
            guestUserIDList,
            boardID,
            boardName
        );
        // console.log(invitation);
        io.emit('send invitation', invitations);
    });
    socket.on('join board', async ({ userID, boardID }) => {
        const { user, board } = await BoardController.joinBoard(userID, boardID);
        io.emit('join board', { user, board });
    });
    socket.on('change state', async ({ boardID, state }) => {
        await BoardController.changeState(boardID, state);
        io.emit('change state', { boardID, state });
    });
    socket.on('ban member', async ({ boardID, memberBannedID }) => {
        await BoardController.banMember(boardID, memberBannedID);
        io.emit('ban member', { boardID, memberBannedID });
    });
    socket.on('change description', async ({ description, boardID }) => {
        await BoardController.changeDescription(description, boardID);
        io.emit('change description', { description, boardID });
    });
    socket.on('add list', async ({ name, boardID, userID }) => {
        const listCreated = await ListController.addList(name, boardID);
        io.emit('add list', { listCreated, boardID, userID });
    });
    socket.on('add card', async ({ name, boardID, listID, userID }) => {
        const cardCreated = await ListController.addCard(name, boardID, listID);
        io.emit('add card', { cardCreated, listID, boardID, userID });
    });
    socket.on('delete list', async ({ listID, boardID }) => {
        await ListController.deleteList(listID, boardID);
        io.emit('delete list', { listID, boardID });
    });
    socket.on('rename list', async ({ rename, listID, boardID }) => {
        await ListController.renameList(rename, listID, boardID);
        io.emit('rename list', { rename, listID, boardID });
    });
    socket.on('reorder list', async ({ listsReorder, boardID, userID }) => {
        await ListController.reorderList(listsReorder, boardID);
        io.emit('reorder list', { listsReorder, boardID, userID });
    });
    socket.on('assign member card', async ({ assignedMembersID, boardID, listID, cardID }) => {
        const assignedMembers = await ListController.assignMember(
            assignedMembersID,
            boardID,
            listID,
            cardID
        );
        io.emit('assign member card', { assignedMembers, boardID, listID, cardID });
    });
    socket.on('change card title', async ({ boardID, listID, cardID, cardTitle }) => {
        await ListController.changeCardTitle(boardID, listID, cardID, cardTitle);
        io.emit('change card title', { boardID, listID, cardID, cardTitle });
    });
    socket.on('change card description', async ({ boardID, listID, cardID, description }) => {
        await ListController.changeCardDescription(boardID, listID, cardID, description);
        io.emit('change card description', { boardID, listID, cardID, description });
    });
    socket.on('delete attachment', async ({ boardID, listID, cardID, attachmentID }) => {
        await ListController.deleteAttachment(boardID, listID, cardID, attachmentID);
        io.emit('delete attachment', { boardID, listID, cardID, attachmentID });
    });
    socket.on('card comment', async ({ boardID, listID, cardID, userID, message }) => {
        const comments = await ListController.sendComment(boardID, listID, cardID, userID, message);
        io.emit('card comment', { boardID, listID, cardID, comments });
    });
    socket.on('card delete comment', async ({ boardID, listID, cardID, commentID }) => {
        const comments = await ListController.deleteComment(boardID, listID, cardID, commentID);
        io.emit('card delete comment', { boardID, listID, cardID, commentID });
    });
    socket.on('card edit comment', async ({ boardID, listID, cardID, commentID, message }) => {
        const comments = await ListController.editComment(
            boardID,
            listID,
            cardID,
            commentID,
            message
        );
        io.emit('card edit comment', { boardID, listID, cardID, commentID, message });
    });
    socket.on('card add label', async ({ boardID, listID, cardID, labelName, color }) => {
        const label = await ListController.addLabel(boardID, listID, cardID, labelName, color);
        io.emit('card add label', { boardID, listID, cardID, label });
    });
    socket.on('card delete label', async ({ boardID, listID, cardID, labelID }) => {
        ListController.deleteLabel(boardID, listID, cardID, labelID);
        io.emit('card delete label', { boardID, listID, cardID, labelID });
    });
    socket.on('card change picture', async ({ boardID, listID, cardID, picture }) => {
        ListController.changeCardPicture(boardID, listID, cardID, picture);
        io.emit('card change picture', { boardID, listID, cardID, picture });
    });
    socket.on('leave board', async ({ userID, boardID }) => {
        await BoardController.leaveBoard(userID, boardID);
        io.emit('leave board', { userID, boardID });
    });
    socket.on('delete board', async (boardID) => {
        await BoardController.deleteBoard(boardID);
        io.emit('delete board', boardID);
    });
    console.log('User connected : ' + socket.id);
});

/**
 * Middleware
 */
app.use('/', cookieParser());
app.use(express.json());
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));

/**
 * Picture Path
 */
app.use(
    '/api/board-picture',
    express.static(path.join(__dirname, 'assets', 'images', 'board-picture'))
);
app.use(
    '/api/user-picture',
    express.static(path.join(__dirname, 'assets', 'images', 'user-picture'))
);
app.use('/api/attachment', express.static(path.join(__dirname, 'assets', 'attachments')));

/**
 * Routes
 */
routes.push(new UserRoutes(app));
routes.push(new BoardRoutes(app));

if (ON_PRODUCTION) {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
