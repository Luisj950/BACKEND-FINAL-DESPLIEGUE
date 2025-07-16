import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException 
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RegisterVetDto } from './dto/register-vet.dto';
import { Rol } from '../auth/enums/rol.enum'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Autentica a un usuario y devuelve un token JWT si las credenciales son válidas.
   */
  async login(loginDto: LoginUserDto) {
    // Se usa el método correcto que sí trae la contraseña
    const user = await this.usersService.findOneByEmailForAuth(loginDto.email);

    const isPasswordMatching = user ? await bcrypt.compare(loginDto.password, user.password) : false;

    if (!user || !isPasswordMatching) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      rol: user.rol, 
      nombres: user.nombres,     
      apellidos: user.apellidos
    };

    return {
      message: 'Login exitoso',
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * Registra un nuevo usuario con el rol de PROPIETARIO por defecto.
   */
  async register(createUserDto: CreateUserDto) {
    return this.usersService.create({
      ...createUserDto,
      rol: Rol.PROPIETARIO,
    });
  }

  /**
   * Registra un nuevo veterinario con el rol de VETERINARIO_PENDIENTE.
   */
  async registerAsVet(registerVetDto: RegisterVetDto) {
    return this.usersService.create({
      ...registerVetDto,
      rol: Rol.VETERINARIO_PENDIENTE,
    });
  }
}