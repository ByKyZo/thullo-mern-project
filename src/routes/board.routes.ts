import { CommonRoutesConfig } from './common.routes.config';
import BoardController from '../controllers/board.controller';
import { Application } from 'express';
import multer from 'multer';

const upload = multer();

export default class BoardRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'BoardRoutes');

        this.configureRoutes();
    }

    configureRoutes() {
        this.app.route('/board/create').post(upload.single('picture'), BoardController.create);
        this.app.route('/board/getallboardbyuserid/:id').get(BoardController.getAllBoardsByUserID);

        this.app.route('/board/:id').get(BoardController.getBoard);

        return this.app;
    }
}
