// src/user/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
  Length,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../shared/enums/roles/role.enum';

// helper: null/'' -> undefined
const nullishToUndef = ({ value }: { value: any }) =>
  value === null || value === '' ? undefined : value;

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    maxLength: 100,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mín. 8 caracteres)',
    example: 'Secr3to123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string; // luego en el service se convierte a passwordHash

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento (YYYY-MM-DD)',
    example: '1990-05-21',
    type: String,
    format: 'date',
  })
  @Transform(nullishToUndef)
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({
    description: 'Teléfono de contacto',
    example: '+43123456789',
  })
  @IsString()
  @Length(5, 32)
  phone: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle 123 #45-67',
  })
  @IsString()
  @Length(3, 160)
  address: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: Role,
    example: Role.Admin,
  })
  @IsEnum(Role)
  role: Role;
}
