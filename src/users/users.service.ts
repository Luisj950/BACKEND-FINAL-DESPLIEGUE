import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Rol } from '../auth/enums/rol.enum';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const existingUser = await this.findOneByEmailForAuth(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException(`El email '${createUserDto.email}' ya está en uso.`);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    const { password, ...result } = savedUser;
    return result;
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }
  
  async findOneByEmailForAuth(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  async findOneByIdForAuth(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword> {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`No se pudo encontrar el usuario con ID ${id}`);
    }
    const updatedUser = await this.userRepository.save(user);
    const { password, ...result } = updatedUser;
    return result;
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`No se pudo encontrar el usuario con ID ${id}`);
    }
    return { message: `Usuario con ID ${id} eliminado.` };
  }

  async findPendingVets(): Promise<UserWithoutPassword[]> {
    return this.userRepository.find({
      where: { rol: Rol.VETERINARIO_PENDIENTE },
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
    const { password, ...result } = approvedUser;
    return result;
  }
}