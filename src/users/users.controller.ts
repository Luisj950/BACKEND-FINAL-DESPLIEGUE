import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  ParseIntPipe,
} from '@nestjs/common';
// ✅ 1. Importa tu nuevo decorador
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity'; // Importa la entidad User
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../auth/enums/rol.enum';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard) 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ... (los otros endpoints como createByAdmin, findAll, etc. se quedan igual) ...

  @Post('create-by-admin')
  @Roles(Rol.ADMIN)
  createByAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto); 
  }
  
  @Get()
  @Roles(Rol.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // ✅ 2. MÉTODO MODIFICADO con el nuevo decorador
  @Get('contacts')
  @Roles(Rol.ADMIN, Rol.PROPIETARIO)
  findAllContacts(@GetUser() user: any) { // Se usa @GetUser() en lugar de @Req()
    const currentUserId = user.sub; // El ID se extrae del objeto 'user'
    return this.usersService.findAllContacts(currentUserId);
  }

  @Get('pending-vets')
  @Roles(Rol.ADMIN)
  findPendingVets() {
    return this.usersService.findPendingVets();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  @Patch(':id/approve-vet')
  @Roles(Rol.ADMIN)
  approveVeterinarian(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.approveVet(id);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}