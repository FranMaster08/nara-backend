// src/operador-pdv/dto/create-operador-pdv.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateOperadorPdvDto {
    @ApiProperty({
        description: 'ID del operador (UUID)',
        example: 'a7e15c36-52de-4c52-a5f9-7cb75a6d7b5d',
    })
    @IsUUID()
    @IsNotEmpty()
    operadorId!: string;

    @ApiProperty({
        description: 'ID del punto de venta (UUID)',
        example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    })
    @IsUUID()
    @IsNotEmpty()
    puntoVentaId!: string;

    @ApiProperty({
        description: 'Indica si la relación está activa',
        example: true,
        default: true,
        required: false,
    })
    @IsBoolean()
    @IsOptional()
    enabled?: boolean = true;
}