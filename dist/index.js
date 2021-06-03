"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', 'config', '.env.local') });
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const board_routes_1 = __importDefault(require("./routes/board.routes"));
const socket_io_1 = require("socket.io");
require("./database/database");
const board_controller_1 = __importDefault(require("./controllers/board.controller"));
const list_controller_1 = __importDefault(require("./controllers/list.controller"));
const ON_PRODUCTION = true;
const app = express_1.default();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const ORIGIN = ON_PRODUCTION ? '' : process.env.ORIGIN;
// const ORIGIN = 'http://localhost:5000';
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ORIGIN,
        credentials: true,
    },
});
// const io = new Server(server);
const routes = [];
// FAIRE UNE CLASSE SOCKET PROPREMENT
io.on('connection', (socket) => {
    socket.on('send invitation', ({ senderPseudo, guestUserIDList, boardID, boardName }) => __awaiter(void 0, void 0, void 0, function* () {
        const invitations = yield board_controller_1.default.sendBoardInvitation(senderPseudo, guestUserIDList, boardID, boardName);
        // console.log(invitation);
        io.emit('send invitation', invitations);
    }));
    socket.on('join board', ({ userID, boardID }) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, board } = yield board_controller_1.default.joinBoard(userID, boardID);
        io.emit('join board', { user, board });
    }));
    socket.on('change state', ({ boardID, state }) => __awaiter(void 0, void 0, void 0, function* () {
        yield board_controller_1.default.changeState(boardID, state);
        io.emit('change state', { boardID, state });
    }));
    socket.on('ban member', ({ boardID, memberBannedID }) => __awaiter(void 0, void 0, void 0, function* () {
        yield board_controller_1.default.banMember(boardID, memberBannedID);
        io.emit('ban member', { boardID, memberBannedID });
    }));
    socket.on('change description', ({ description, boardID }) => __awaiter(void 0, void 0, void 0, function* () {
        yield board_controller_1.default.changeDescription(description, boardID);
        io.emit('change description', { description, boardID });
    }));
    socket.on('add list', ({ name, boardID, userID }) => __awaiter(void 0, void 0, void 0, function* () {
        const listCreated = yield list_controller_1.default.addList(name, boardID);
        io.emit('add list', { listCreated, boardID, userID });
    }));
    socket.on('add card', ({ name, boardID, listID, userID }) => __awaiter(void 0, void 0, void 0, function* () {
        const cardCreated = yield list_controller_1.default.addCard(name, boardID, listID);
        io.emit('add card', { cardCreated, listID, boardID, userID });
    }));
    socket.on('delete list', ({ listID, boardID }) => __awaiter(void 0, void 0, void 0, function* () {
        yield list_controller_1.default.deleteList(listID, boardID);
        io.emit('delete list', { listID, boardID });
    }));
    socket.on('rename list', ({ rename, listID, boardID }) => __awaiter(void 0, void 0, void 0, function* () {
        yield list_controller_1.default.renameList(rename, listID, boardID);
        io.emit('rename list', { rename, listID, boardID });
    }));
    socket.on('reorder list', ({ listsReorder, boardID, userID }) => __awaiter(void 0, void 0, void 0, function* () {
        yield list_controller_1.default.reorderList(listsReorder, boardID);
        io.emit('reorder list', { listsReorder, boardID, userID });
    }));
    socket.on('assign member card', ({ assignedMembersID, boardID, listID, cardID }) => __awaiter(void 0, void 0, void 0, function* () {
        const assignedMembers = yield list_controller_1.default.assignMember(assignedMembersID, boardID, listID, cardID);
        io.emit('assign member card', { assignedMembers, boardID, listID, cardID });
    }));
    socket.on('change card title', ({ boardID, listID, cardID, cardTitle }) => __awaiter(void 0, void 0, void 0, function* () {
        yield list_controller_1.default.changeCardTitle(boardID, listID, cardID, cardTitle);
        io.emit('change card title', { boardID, listID, cardID, cardTitle });
    }));
    socket.on('change card description', ({ boardID, listID, cardID, description }) => __awaiter(void 0, void 0, void 0, function* () {
        yield list_controller_1.default.changeCardDescription(boardID, listID, cardID, description);
        io.emit('change card description', { boardID, listID, cardID, description });
    }));
    socket.on('delete attachment', ({ boardID, listID, cardID, attachmentID }) => __awaiter(void 0, void 0, void 0, function* () {
        yield list_controller_1.default.deleteAttachment(boardID, listID, cardID, attachmentID);
        io.emit('delete attachment', { boardID, listID, cardID, attachmentID });
    }));
    socket.on('card comment', ({ boardID, listID, cardID, userID, message }) => __awaiter(void 0, void 0, void 0, function* () {
        const comments = yield list_controller_1.default.sendComment(boardID, listID, cardID, userID, message);
        io.emit('card comment', { boardID, listID, cardID, comments });
    }));
    socket.on('card delete comment', ({ boardID, listID, cardID, commentID }) => __awaiter(void 0, void 0, void 0, function* () {
        const comments = yield list_controller_1.default.deleteComment(boardID, listID, cardID, commentID);
        io.emit('card delete comment', { boardID, listID, cardID, commentID });
    }));
    socket.on('card edit comment', ({ boardID, listID, cardID, commentID, message }) => __awaiter(void 0, void 0, void 0, function* () {
        const comments = yield list_controller_1.default.editComment(boardID, listID, cardID, commentID, message);
        io.emit('card edit comment', { boardID, listID, cardID, commentID, message });
    }));
    socket.on('card add label', ({ boardID, listID, cardID, labelName, color }) => __awaiter(void 0, void 0, void 0, function* () {
        const label = yield list_controller_1.default.addLabel(boardID, listID, cardID, labelName, color);
        io.emit('card add label', { boardID, listID, cardID, label });
    }));
    socket.on('card delete label', ({ boardID, listID, cardID, labelID }) => __awaiter(void 0, void 0, void 0, function* () {
        list_controller_1.default.deleteLabel(boardID, listID, cardID, labelID);
        io.emit('card delete label', { boardID, listID, cardID, labelID });
    }));
    socket.on('leave board', ({ userID, boardID }) => __awaiter(void 0, void 0, void 0, function* () {
        yield board_controller_1.default.leaveBoard(userID, boardID);
        io.emit('leave board', { userID, boardID });
    }));
    socket.on('delete board', (boardID) => __awaiter(void 0, void 0, void 0, function* () {
        yield board_controller_1.default.deleteBoard(boardID);
        io.emit('delete board', boardID);
    }));
    console.log('User connected : ' + socket.id);
});
/**
 * Middleware
 */
app.use('/', cookie_parser_1.default());
app.use(express_1.default.json());
app.use(cors_1.default({ origin: ORIGIN, credentials: true }));
app.use(express_1.default.urlencoded({ extended: true }));
/**
 * Picture Path
 */
app.use('/board-picture', express_1.default.static(path_1.default.join(__dirname, 'assets', 'images', 'board-picture')));
app.use('/user-picture', express_1.default.static(path_1.default.join(__dirname, 'assets', 'images', 'user-picture')));
app.use('/attachment', express_1.default.static(path_1.default.join(__dirname, 'assets', 'attachments')));
/**
 * Routes
 */
routes.push(new user_routes_1.default(app));
routes.push(new board_routes_1.default(app));
if (ON_PRODUCTION) {
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'client', 'build')));
    app.use('*', express_1.default.static(path_1.default.join(__dirname, '..', 'client', 'build'))); // Added this
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '..', 'client', 'build', 'index.html'));
    });
}
server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
