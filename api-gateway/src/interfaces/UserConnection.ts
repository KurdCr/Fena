import { Socket } from 'socket.io';

export interface UserConnection {
  userId: string;
  socket: Socket;
}
