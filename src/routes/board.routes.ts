import { CommonRoutesConfig } from './common.routes.config';
import BoardController from '../controllers/board.controller';
import { Application } from 'express';
import multer from 'multer';
import ListController from '../controllers/list.controller';

const upload = multer();

export default class BoardRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'BoardRoutes');

        this.configureRoutes();
    }

    configureRoutes() {
        this.app.route('/board/create').post(upload.single('picture'), BoardController.create);
        this.app.route('/board/getallboardbyuserid/:id').get(BoardController.getAllBoardsByUserID);
        this.app.route('/board/card/:id').post(ListController.getCard);
        this.app.route('/board/members/:id').post(BoardController.getAvailableAssignedMembers);
        this.app
            .route('/board/list/card/download-attachment')
            .post(ListController.downloadAttachment);

        this.app
            .route('/board/list/card/attachment')
            .post(upload.single('attachment'), ListController.addAttachment);

        this.app.route('/board/:id').get(BoardController.getBoard);

        return this.app;
    }
}
