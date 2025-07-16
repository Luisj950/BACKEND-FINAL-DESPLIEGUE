// src/chat/chat.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MensajeChat } from '../chat/entities/mensaje-chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(MensajeChat)
    private readonly mensajeRepository: Repository<MensajeChat>,
  ) {}

  async crearMensaje(
    contenido: string,
    remitenteId: number,
    destinatarioId: number,
  ): Promise<MensajeChat> {
    const nuevoMensaje = this.mensajeRepository.create({
      mensaje: contenido,
      remitenteId,
      destinatarioId,
    });

    const mensajeGuardado = await this.mensajeRepository.save(nuevoMensaje);
    
    const mensajeConEmisor = await this.mensajeRepository.findOne({
      where: { id: mensajeGuardado.id },
      relations: ['emisor'],
    });

    if (!mensajeConEmisor) {
      throw new NotFoundException('No se pudo encontrar el mensaje recién creado.');
    }
    
    return mensajeConEmisor;
  }

  async obtenerHistorialDeChat(userId1: number, userId2: number): Promise<MensajeChat[]> {
    // ✅ ASÍ QUEDA: Se modifica la función original para añadir el console.log
    const historial = await this.mensajeRepository.find({
      where: [
        { remitenteId: userId1, destinatarioId: userId2 },
        { remitenteId: userId2, destinatarioId: userId1 },
      ],
      relations: ['emisor'],
      order: { fechaEnvio: 'ASC' },
    });

    console.log('HISTORIAL OBTENIDO DESDE LA DB:', historial);
    return historial;
  }
}