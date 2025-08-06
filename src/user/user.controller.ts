import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto-responses/user-response.dto';

@ApiTags('Usuarios')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) { }

  @ApiOperation({
    summary: 'Crear un usuario',
    description: 'Crea un nuevo usuario en el sistema.',
  })
  @ApiCreatedResponse({ description: 'Usuario creado exitosamente', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Error al crear usuario' })
  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log('Creando usuario');
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Recupera la lista completa de usuarios registrados.',
  })
  @ApiOkResponse({ description: 'Listado de usuarios', type: UserResponseDto, isArray: true })
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Listando usuarios');
    return await this.userService.findAll();
  }

  @ApiOperation({
    summary: 'Obtener un usuario por id',
    description: 'Recupera un usuario específico según su identificador.',
  })
  @ApiOkResponse({ description: 'Usuario encontrado', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.log(`Buscando usuario id=${id}`);
    return await this.userService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Actualizar un usuario por id',
    description: 'Actualiza los datos de un usuario existente identificado por su id.',
  })
  @ApiOkResponse({ description: 'Usuario actualizado', type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiBadRequestResponse({ description: 'Error al actualizar usuario' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`Actualizando usuario id=${id}`);
    return await this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Eliminar un usuario por id',
    description: 'Elimina un usuario según su identificador.',
  })
  @ApiNoContentResponse({ description: 'Usuario eliminado correctamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Eliminando usuario id=${id}`);
    await this.userService.remove(+id);
  }
}