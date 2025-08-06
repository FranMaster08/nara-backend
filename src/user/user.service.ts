import { Injectable, NotFoundException, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { UserResponseDto } from './dto-responses/user-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      this.logger.log(`Usuario creado: ${user.email}`);
      return this.toResponseDto(user);
    } catch (error) {
      this.logger.error(`Error al crear usuario: ${error.message}`);
      throw new HttpException('Error al crear usuario', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Obteniendo todos los usuarios');
    const users = await this.userRepository.find();
    return users.map(u => this.toResponseDto(u));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`Usuario no encontrado: ${id}`);
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    this.logger.log(`Usuario encontrado: ${user.email}`);
    return this.toResponseDto(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`Usuario no encontrado: ${id}`);
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    this.logger.log(`Usuario actualizado: ${user.email}`);
    return this.toResponseDto(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`Usuario no encontrado: ${id}`);
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    await this.userRepository.remove(user);
    this.logger.log(`Usuario eliminado: ${user.email}`);
  }

  private toResponseDto(user: Users): UserResponseDto {
    const { id, name, email, age } = user;
    return { id, name, email, age };
  }
}
