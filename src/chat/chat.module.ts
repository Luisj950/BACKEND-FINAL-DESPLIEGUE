import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MensajeChat } from '../users/entities/mensaje-chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MensajeChat])
  ],
})
export class ChatModule {}