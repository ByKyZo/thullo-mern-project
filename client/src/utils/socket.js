import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';

export default io(SOCKET_URL);
