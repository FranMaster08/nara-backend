import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Matches,
    Max,
    Min,
} from 'class-validator';

const nullishToUndef = ({ value }: { value: any }) =>
    value === null || value === '' ? undefined : value;

const DECIMAL_RE = /^(?:\d+)(?:\.\d+)?$/;

export class ProductoListQueryDto {
    @ApiPropertyOptional({ description: 'Nombre contiene (ILIKE)', example: 'teclado' })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsString()
    nombre?: string;

    @ApiPropertyOptional({ description: 'SKU contiene (ILIKE)', example: 'SKU-TEC' })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({ description: 'Filtrar por status', example: true })
    @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @ApiPropertyOptional({ description: 'Precio mínimo (string decimal)', example: '10.00' })
    @Transform(nullishToUndef)
    @IsOptional()
    @Matches(DECIMAL_RE)
    precioMin?: string;

    @ApiPropertyOptional({ description: 'Precio máximo (string decimal)', example: '100.00' })
    @Transform(nullishToUndef)
    @IsOptional()
    @Matches(DECIMAL_RE)
    precioMax?: string;

    @ApiPropertyOptional({ description: 'Página (por defecto 1)', example: 1 })
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ description: 'Límite (por defecto 20, máx 100)', example: 20 })
    @Transform(({ value }) => (value ? Number(value) : 20))
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;

    @ApiPropertyOptional({
        description: 'Campo de orden',
        enum: ['nombre', 'precio_unitario', 'createdAt', 'updatedAt', 'sku'],
        example: 'createdAt',
    })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsIn(['nombre', 'precio_unitario', 'createdAt', 'updatedAt', 'sku'])
    sortBy?: 'nombre' | 'precio_unitario' | 'createdAt' | 'updatedAt' | 'sku';

    @ApiPropertyOptional({ description: 'Dirección de orden', enum: ['ASC', 'DESC'], example: 'DESC' })
    @Transform(({ value }) => (value === 'ASC' ? 'ASC' : 'DESC'))
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}