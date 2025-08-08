import { IsString, IsEmail, IsOptional, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@email.com',
    uniqueItems: true,
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Edad del usuario',
    example: 30,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  age?: number;


  @ApiProperty({
    description: 'ROL del usuario',
    example: 'ADMIN',
  })
  @IsString()
  role: string;

  @ApiProperty({
    description: 'Id del tipo de documento del usuario',
    example: '1',
  })
  @IsNumber()
  documenTypeId: number;


  @ApiProperty({
    description: 'documento del usuario',
    example: '11564612',
  })
  @IsString()
  documenNumber: string;


  @ApiProperty({
    description: 'telefono del usuario',
    example: '11564612',
  })
  @IsString()
  cellphone: string;


  @ApiProperty({
    description: 'direccion del usuario',
    example: 'calle 123 #45-67',
  })
  @IsString()
  address: string;


}
