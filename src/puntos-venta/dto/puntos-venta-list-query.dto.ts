// src/puntos-venta/dto/puntos-venta-list-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsInt, Min, Max, IsIn } from 'class-validator';

const nullish = ({ value }: any) => (value === null || value === '' ? undefined : value);

export class PuntosVentaListQueryDto {
    @ApiPropertyOptional({ description: 'Nombre contiene (ILIKE)', example: 'Centro' })
    @Transform(nullish)
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: 'Dirección contiene (ILIKE)', example: 'Av.' })
    @Transform(nullish)
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ description: 'Teléfono contiene (ILIKE)', example: '1234' })
    @Transform(nullish)
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ description: 'Activo/inactivo', example: true })
    @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
    @IsOptional()
    @IsBoolean()
    status?: boolean;

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
        enum: ['createdAt', 'updatedAt', 'name', 'address', 'status'],
        example: 'createdAt',
    })
    @Transform(nullish)
    @IsOptional()
    @IsIn(['createdAt', 'updatedAt', 'name', 'address', 'status'])
    sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'address' | 'status';

    @ApiPropertyOptional({ description: 'Dirección de orden', enum: ['ASC', 'DESC'], example: 'DESC' })
    @Transform(({ value }) => (value === 'ASC' ? 'ASC' : 'DESC'))
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}