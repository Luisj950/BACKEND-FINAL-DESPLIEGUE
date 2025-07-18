import { Module, forwardRef } from '@nestjs/common'; // ✅ Importar forwardRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicaVeterinaria } from './entities/clinica.entity';
import { UsersModule } from '../users/users.module'; // ✅ Importar el módulo de Users

@Module({
  imports: [
    TypeOrmModule.forFeature([ClinicaVeterinaria]),
    forwardRef(() => UsersModule), // ✅ Usar forwardRef aquí
  ],
  controllers: [], // Agrega tus controllers si los tienes
  providers: [],   // Agrega tus services si los tienes
  exports: [TypeOrmModule], // ✅ ¡Muy importante! Exportar TypeOrmModule
})
export class ClinicasModule {}