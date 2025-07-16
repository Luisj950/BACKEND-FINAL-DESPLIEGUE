// src/chat/chat.gateway.ts

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { SocketAuthMiddleware } from './socket-auth.middleware';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    server.use(SocketAuthMiddleware(this.jwtService));
    console.log('✅ Socket Middleware de autenticación inicializado.');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}, userId: ${client.handshake.auth.userId}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
  
  @SubscribeMessage('unirseAChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receptorId: number }
  ): Promise<void> {
    const emisorId = client.handshake.auth.userId;
    if (!emisorId) return;

    const roomId = this.getRoomId(emisorId, payload.receptorId);
    client.join(roomId);

    const historial = await this.chatService.obtenerHistorialDeChat(emisorId, payload.receptorId);
    client.emit('cargarHistorial', historial);
  }

  @SubscribeMessage('enviarMensaje')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { mensaje: string; receptorId: number }
  ): Promise<void> {
    const emisorId = client.handshake.auth.userId;
    if (!emisorId) return;
    
    const nuevoMensaje = await this.chatService.crearMensaje(
      payload.mensaje,
      emisorId,
      payload.receptorId,
    );
    
    const roomId = this.getRoomId(emisorId, payload.receptorId);

    // ✅ ASÍ QUEDA: Se añade el log para verificar que se está emitiendo el mensaje.
    console.log(`EMITIENDO 'nuevoMensaje' a la sala ${roomId}:`, nuevoMensaje);
    
    this.server.to(roomId).emit('nuevoMensaje', nuevoMensaje);
  }

  private getRoomId(userId1: number, userId2: number): string {
    return [userId1, userId2].sort((a, b) => a - b).join('_');
  }
}