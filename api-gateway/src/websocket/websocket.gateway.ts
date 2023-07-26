import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConsumerService } from 'src/kafka-consumer/consumer.service';
import { UserConnection } from 'src/interfaces/UserConnection';

@WebSocketGateway({ cors: true })
export class AppWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly consumerService: ConsumerService) { }
  // Keeping an active list of currently connected users
  private connectedUsers: Map<string, UserConnection> = new Map();

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized.');
    this.consumerService.consume({
      topics: { topics: ['emailJob_updates'] },
      config: { groupId: 'main-consumer' },
      onMessage: async (message) => {
        const data = JSON.parse(message.value.toString());
        console.log(
          `Update from email microservice to user Id: ${data.userId
          } ${message.value.toString()}`,
        );
        this.sendToClient(data.userId, 'emailJob_updates', data);
      },
    });
  }

  @SubscribeMessage('emailJob_updates')
  handleConnection(client: Socket) {
    // Store the user's WebSocket connection
    const userId = client.handshake.query.userId[0];
    this.connectedUsers.set(userId, { userId, socket: client });
    console.log(
      `Client connected. Socket ID: ${client.id}, User Id: ${userId}`,
    );
    console.log(`List of current connected users` + this.connectedUsers);
  }

  handleDisconnect(client: Socket) {
    // Find and remove the user's WebSocket connection when they disconnect
    for (const [userId, userConnection] of this.connectedUsers.entries()) {
      if (userConnection.socket === client) {
        this.connectedUsers.delete(userId);
        console.log(
          `Client disconnected. Socket Id: ${client.id}, User Id: ${userId}`,
        );
        console.log(`List of current connected users` + this.connectedUsers);
        break;
      }
    }
  }

  sendToClient(userId: string, event: string, data: any) {
    const userConnection = this.connectedUsers.get(userId);
    if (userConnection) {
      userConnection.socket.emit(event, data);
    } else {
      console.log(`User with Id ${userId} is not connected.`);
    }
  }
}
