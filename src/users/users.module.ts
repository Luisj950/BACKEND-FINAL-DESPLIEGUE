// src/users/users.module.ts

import { Module, forwardRef } from '@nestjs/common'; // ✅ Importar forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { ClinicasModule } from '../clinicas/clinicas.module'; // ✅ Importar el módulo de Clínicas

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ClinicasModule), // ✅ Usar forwardRef para romper la dependencia circular
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}