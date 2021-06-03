import { CommonRoutesConfig } from './common.routes.config';
import BoardController from '../controllers/board.controller';
import { Application } from 'express';
import multer from 'multer';
import ListController from '../controllers/list.controller';
import express from 'express';
import path from 'node:path';

const upload = multer();

export default class BoardRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'BoardRoutes');

        this.configureRoutes();
    }

    configureRoutes() {
        this.app.route('/api/board/create').post(upload.single('picture'), BoardController.create);
        this.app
            .route('/api/board/getallboardbyuserid/:id')
            .get(BoardController.getAllBoardsByUserID);
        this.app.route('/api/board/card/:id').post(ListController.getCard);
        this.app.route('/api/board/members/:id').post(BoardController.getAvailableAssignedMembers);
        this.app
            .route('/api/board/list/card/download-attachment')
            .post(ListController.downloadAttachment);

        this.app
            .route('/api/board/list/card/attachment')
            .post(upload.single('attachment'), ListController.addAttachment);

        this.app.route('/api/board/:id').get(BoardController.getBoard);

        return this.app;
    }
}
