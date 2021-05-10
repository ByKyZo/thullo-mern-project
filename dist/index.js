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
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', 'config', '.env') });
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const board_routes_1 = __importDefault(require("./routes/board.routes"));
const socket_io_1 = require("socket.io");
require("./database/database");
const board_controller_1 = __importDefault(require("./controllers/board.controller"));
const app = express_1.default();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ORIGIN,
        credentials: true,
    },
});
const routes = [];
// FAIRE UNE CLASSE SOCKET PROPREMENT
io.on('connection', (socket) => {
    socket.on('send invitation', ({ guestUserIDList, boardID }) => __awaiter(void 0, void 0, void 0, function* () {
        const invitations = yield board_controller_1.default.sendBoardInvitation(guestUserIDList, boardID);
        // console.log(invitation);
        io.emit('send invitation', invitations);
    }));
    console.log('User connected : ' + socket.id);
});
/**
 * Middleware
 */
app.use('/', cookie_parser_1.default()); // a voir pour enlever le /
app.use(cors_1.default({ origin: ORIGIN, credentials: true }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
/**
 * Picture Path
 */
app.use('/board-picture', express_1.default.static(path_1.default.join(__dirname, 'assets', 'images', 'board-picture')));
app.use('/user-picture', express_1.default.static(path_1.default.join(__dirname, 'assets', 'images', 'user-picture')));
/**
 * Routes
 */
routes.push(new user_routes_1.default(app));
routes.push(new board_routes_1.default(app));
server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
