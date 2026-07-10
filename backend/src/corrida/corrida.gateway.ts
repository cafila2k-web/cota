// backend/src/corrida/corrida.gateway.ts
// COTA - NestJS Socket.IO Real-Time Dispatch Gateway

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'corrida',
})
export class CorridaGateway {
  @WebSocketServer()
  server: Server;

  // Rastreamento ativo de conexões de motoristas
  private motoristasOnline = new Map<string, string>(); // socketId -> motoristaId

  handleConnection(client: Socket) {
    console.log(`Cliente conectado ao canal em tempo real: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const motoristaId = this.motoristasOnline.get(client.id);
    if (motoristaId) {
      this.motoristasOnline.delete(client.id);
      console.log(`Motorista desconectado: ${motoristaId}`);
    }
  }

  @SubscribeMessage('motorista:entrar_servico')
  handleDriverOnline(
    @MessageBody() data: { motoristaId: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.motoristasOnline.set(client.id, data.motoristaId);
    console.log(`Motorista ${data.motoristaId} está ONLINE e pronto para receber chamados.`);
    return { status: 'registrado' };
  }

  // Envia solicitação de corrida para todos os motoristas próximos
  broadcastNovaCorrida(corridaInfo: any) {
    console.log(`Despachando nova corrida #${corridaInfo.id} via WebSockets.`);
    this.server.emit('corrida:nova_solicitacao', corridaInfo);
  }

  // Atualização instantânea de coordenadas GPS das viaturas
  @SubscribeMessage('viatura:telemetria_gps')
  handleGpsUpdate(
    @MessageBody() data: { viaturaId: string; latitude: number; longitude: number; velocidade: number },
  ) {
    // Re-transmite as coordenadas para o painel de monitorização administrativa
    this.server.emit(`viatura:${data.viaturaId}:coordenadas`, {
      latitude: data.latitude,
      longitude: data.longitude,
      velocidade: data.velocidade,
      timestamp: new Date().toISOString(),
    });
  }
}
