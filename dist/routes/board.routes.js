"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_routes_config_1 = require("./common.routes.config");
const board_controller_1 = __importDefault(require("../controllers/board.controller"));
const multer_1 = __importDefault(require("multer"));
const list_controller_1 = __importDefault(require("../controllers/list.controller"));
const upload = multer_1.default();
class BoardRoutes extends common_routes_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'BoardRoutes');
        this.configureRoutes();
    }
    configureRoutes() {
        this.app.route('/api/board/create').post(upload.single('picture'), board_controller_1.default.create);
        this.app
            .route('/api/board/getallboardbyuserid/:id')
            .get(board_controller_1.default.getAllBoardsByUserID);
        this.app.route('/api/board/card/:id').post(list_controller_1.default.getCard);
        this.app.route('/api/board/members/:id').post(board_controller_1.default.getAvailableAssignedMembers);
        this.app
            .route('/api/board/list/card/download-attachment')
            .post(list_controller_1.default.downloadAttachment);
        this.app
            .route('/api/board/list/card/attachment')
            .post(upload.single('attachment'), list_controller_1.default.addAttachment);
        this.app.route('/api/board/:id').get(board_controller_1.default.getBoard);
        return this.app;
    }
}
exports.default = BoardRoutes;
