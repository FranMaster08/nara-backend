import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, ValidateNested, IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/** Línea mínima para crear un pedido */
export class CreateLineaDto {
    @ApiProperty({ description: 'ID del producto', example: 'prod-123' })
    @IsString()
    @IsNotEmpty()
    productoId!: string;

    @ApiProperty({ description: 'Cantidad', example: 2, minimum: 1 })
    @IsInt()
    @Min(1)
    cantidad!: number;
}

export class CreatePedidoDto {
    @ApiProperty({ description: 'Código del pedido (visible al usuario)', example: 'PED-2025-0001', maxLength: 100 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    codigo!: string;

    @ApiProperty({ description: 'Estado inicial del pedido', example: 'PENDIENTE' })
    @IsString()
    @IsNotEmpty()
    estado!: string;

    @ApiPropertyOptional({ description: 'Notas internas u observaciones', example: 'Entregar sin contacto.' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    notas?: string;

    @ApiProperty({ description: 'Usuario (operador) dueño del pedido', example: 'user-uuid' })
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @ApiPropertyOptional({ description: 'Punto de venta asociado', example: 'pdv-uuid' })
    @IsOptional()
    @IsString()
    puntoVentaId?: string;

    @ApiProperty({ description: 'Quién crea el pedido (id de usuario o sistema)', example: 'user-uuid' })
    @IsString()
    @IsNotEmpty()
    createBy!: string;

    @ApiPropertyOptional({ description: 'Estatus activo/inactivo del pedido', example: true, default: true })
    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @ApiProperty({ description: 'Líneas del pedido', type: [CreateLineaDto] })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateLineaDto)
    lineas!: CreateLineaDto[];
}