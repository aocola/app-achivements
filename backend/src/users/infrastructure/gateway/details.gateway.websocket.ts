import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
        origin: '*', // Reemplaza con el dominio específico en producción
        methods: ['GET', 'POST', 'PUT'],
        credentials: true,
    },
  })
  export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`Cliente conectado: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Cliente desconectado: ${client.id}`);
    }
  
    @SubscribeMessage('join')
    handleJoinRoom(
      @MessageBody() userId: string,
      @ConnectedSocket() client: Socket
    ) {
      client.join(userId); // El cliente se une a una sala específica (por userId)
      console.log(`Cliente ${client.id} unido a la sala: ${userId}`);
    }
  
    @SubscribeMessage('notifyApproval')
    handleNotification(
      @MessageBody() message: { userId: string; detailId: string; status: string; counter: number }
    ) {
        const { userId } = message;
        console.log(`Enviando notificación a la sala: ${userId}`);
        this.server.to(userId).emit('notifyApproval', message);
    }

    @SubscribeMessage('joinAdmin')
    handleJoinAdmin(@ConnectedSocket() client: Socket) {
        client.join('admin'); // Todos los administradores se unen a la sala 'admin'
        console.log(`Cliente ${client.id} unido a la sala de administradores.`);
    }
  }
  