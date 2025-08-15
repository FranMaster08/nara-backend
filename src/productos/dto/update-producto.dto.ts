import { PartialType } from '@nestjs/swagger';
import { CreateProductoDto } from './create-producto.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, IsBoolean, MaxLength } from 'class-validator';

const nullishToUndef = ({ value }: { value: any }) =>
    value === null || value === '' ? undefined : value;

const DECIMAL_RE = /^(?:\d+)(?:\.\d+)?$/;

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
    @ApiPropertyOptional({
        description: 'Nombre del producto',
        example: 'Teclado mecánico 60% (edición 2025)',
    })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsString()
    @MaxLength(200)
    nombre?: string;

    @ApiPropertyOptional({
        description: 'Precio unitario como string decimal',
        example: '54.90',
    })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsString()
    @Matches(DECIMAL_RE, { message: 'precio_unitario debe ser decimal válido' })
    precio_unitario?: string;

    @ApiPropertyOptional({
        description: 'SKU único',
        example: 'SKU-TECLADO-60P-NEGRO-2025',
    })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsString()
    @MaxLength(120)
    sku?: string;

    @ApiPropertyOptional({ description: 'Estatus del producto', example: true })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}