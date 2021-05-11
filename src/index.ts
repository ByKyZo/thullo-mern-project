import express from 'express';
import * as http from 'http';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });
import cors from 'cors';
import { CommonRoutesConfig } from './routes/common.routes.config';
import cookieParser from 'cookie-parser';
import UserRoutes from './routes/user.routes';
import BoardRoutes from './routes/board.routes';
import { Server } from 'socket.io';
import './database/database';
import BoardController from './controllers/board.controller';

const ON_PRODUCTION = true;

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
    console.log('User connected : ' + socket.id);
});

/**
 * Middleware
 */
app.use('/', cookieParser()); // a voir pour enlever le /
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Picture Path
 */
app.use(
    '/board-picture',
    express.static(path.join(__dirname, 'assets', 'images', 'board-picture'))
);
app.use('/user-picture', express.static(path.join(__dirname, 'assets', 'images', 'user-picture')));

if (ON_PRODUCTION) {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
    app.get('/*', (_, res) => {
        res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    });
}

/**
 * Routes
 */
routes.push(new UserRoutes(app));
routes.push(new BoardRoutes(app));

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
