import { ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { CreatePedidoDto, CreateLineaDto } from './create-pedido.dto';
import { IsOptional, IsString, IsArray, ValidateNested, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/** Línea de actualización: todos sus campos opcionales */
export class UpdateLineaDto {
    @ApiPropertyOptional({ description: 'ID del producto', example: 'prod-123' })
    @IsOptional()
    @IsString()
    productoId?: string;

    @ApiPropertyOptional({ description: 'Cantidad', example: 3, minimum: 1 })
    @IsOptional()
    @IsInt()
    @Min(1)
    cantidad?: number;
}

/**
 * Base: todos los campos de CreatePedidoDto en opcional,
 * excepto 'lineas' (la quitamos para redefinirla abajo).
 */
class UpdatePedidoBaseDto extends PartialType(
    OmitType(CreatePedidoDto, ['lineas'] as const),
) { }

/** DTO final: redefine 'lineas' con UpdateLineaDto[] opcional */
export class UpdatePedidoDto extends UpdatePedidoBaseDto {
    @ApiPropertyOptional({
        description:
            'Si se envía, reemplaza completamente las líneas del pedido (DELETE + INSERT).',
        type: [UpdateLineaDto],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateLineaDto)
    lineas?: UpdateLineaDto[];
}