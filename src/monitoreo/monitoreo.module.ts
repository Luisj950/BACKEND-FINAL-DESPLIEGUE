import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoreoAlerta } from '../users/entities/monitoreo-alerta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitoreoAlerta])
  ],
})
export class MonitoreoModule {}