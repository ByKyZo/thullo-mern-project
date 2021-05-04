import express from 'express';
import * as http from 'http';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });
import cors from 'cors';
import { CommonRoutesConfig } from './routes/common.routes.config';
import { UserRoutes } from './routes/user.routes';
import './database/database';

const app: express.Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const routes: Array<CommonRoutesConfig> = [];

// FAIRE UNE CLASSE SOCKET PROPREMENT

/**
 * Middleware
 */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * Routes
 */
routes.push(new UserRoutes(app));


server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})