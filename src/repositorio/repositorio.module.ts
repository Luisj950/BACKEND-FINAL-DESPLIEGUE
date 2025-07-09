import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositorioClinicoAnonimizado } from '../users/entities/repositorio-clinico.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RepositorioClinicoAnonimizado])
  ],
})
export class RepositorioModule {}