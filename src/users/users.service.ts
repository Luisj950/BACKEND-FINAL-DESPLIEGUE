// src/users/users.service.ts

import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Rol } from '../auth/enums/rol.enum';

// Definimos un tipo para el objeto de usuario sin la contraseña, para reutilizarlo.
type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario. Se encarga de verificar si el email existe,
   * hashear la contraseña y asignar el rol.
   * Este es el ÚNICO método que se debe usar para crear usuarios.
   */
  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException(`El email '${createUserDto.email}' ya está en uso.`);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    const savedUser = await this.userRepository.save(newUser);
    
    // Devolvemos el usuario sin la contraseña de forma segura.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedUser;
    return result;
  }

  /**
   * Devuelve todos los usuarios sin su contraseña.
   */
  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.userRepository.find();
    return users.map(user => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    });
  }

  /**
   * Devuelve un usuario por su ID, sin la contraseña.
   */
  async findOne(id: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
  
  /**
   * Busca un usuario por email (para uso interno, ej: login).
   * Este es uno de los pocos métodos que debe devolver la entidad completa.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  /**
   * Busca un usuario por ID y devuelve la entidad completa (incluyendo contraseña).
   * Este método solo debe ser usado internamente por el sistema de autenticación.
   */
  async findOneByIdForAuth(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`No se pudo encontrar el usuario con ID ${id} para actualizar`);
    }
    const updatedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se pudo encontrar el usuario con ID ${id} para eliminar`);
    }
    return { message: `Usuario con ID ${id} eliminado correctamente.` };
  }

  // --- MÉTODOS PARA LA GESTIÓN DE VETERINARIOS ---

  async findPendingVets(): Promise<UserWithoutPassword[]> {
    const pendingVets = await this.userRepository.find({
      where: { rol: Rol.VETERINARIO_PENDIENTE },
    });
    return pendingVets.map(user => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    });
  }

  async approveVet(id: number): Promise<UserWithoutPassword> {
    const user = await this.findOneByIdForAuth(id);

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
    }

    if (user.rol !== Rol.VETERINARIO_PENDIENTE) {
      throw new BadRequestException(`El usuario no es un veterinario pendiente de aprobación.`);
    }

    user.rol = Rol.VETERINARIO;
    const approvedUser = await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = approvedUser;
    return result;
  }
}