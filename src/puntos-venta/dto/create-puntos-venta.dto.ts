// src/puntos-venta/dto/create-puntos-venta.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePuntosVentaDto {
    @ApiProperty({ description: 'Nombre del punto de venta', example: 'Sucursal Centro' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    name!: string;

    @ApiProperty({ description: 'Dirección', example: 'Av. Siempre Viva 742' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(250)
    address!: string;

    @ApiProperty({ description: 'Teléfono de contacto', example: '+54 11 1234-5678' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(40)
    phone!: string;

    @ApiProperty({ description: 'Latitud (texto)', example: '-34.6037' })
    @IsString()
    @IsNotEmpty()
    lat!: string;

    @ApiProperty({ description: 'Longitud (texto)', example: '-58.3816' })
    @IsString()
    @IsNotEmpty()
    lng!: string;

    @ApiPropertyOptional({ description: 'Estatus activo', example: true, default: true })
    @IsOptional()
    @IsBoolean()
    status?: boolean = true;
}