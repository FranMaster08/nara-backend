import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsInt, Min, Max, IsIn } from 'class-validator';

// helper
const nullish = ({ value }: any) => (value === null || value === '' ? undefined : value);

export class PedidoListQueryDto {
    @ApiPropertyOptional({ description: 'Código contiene (ILIKE)', example: 'PED-2025' })
    @Transform(nullish)
    @IsOptional()
    @IsString()
    codigo?: string;

    @ApiPropertyOptional({ description: 'Estado exacto', example: 'PENDIENTE' })
    @Transform(nullish)
    @IsOptional()
    @IsString()
    estado?: string;

    @ApiPropertyOptional({ description: 'ID de usuario (owner)', example: 'user-uuid' })
    @Transform(nullish)
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiPropertyOptional({ description: 'ID del punto de venta', example: 'pdv-uuid' })
    @Transform(nullish)
    @IsOptional()
    @IsString()
    puntoVentaId?: string;

    @ApiPropertyOptional({ description: 'Estatus activo/inactivo', example: true })
    @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @ApiPropertyOptional({ description: 'Paginación: página (por defecto 1)', example: 1 })
    @Transform(({ value }) => (value ? Number(value) : 1))
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ description: 'Paginación: límite (por defecto 20, máx 100)', example: 20 })
    @Transform(({ value }) => (value ? Number(value) : 20))
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;

    @ApiPropertyOptional({
        description: 'Campo de orden',
        enum: ['createdAt', 'updatedAt', 'codigo', 'estado'],
        example: 'createdAt',
    })
    @Transform(nullish)
    @IsOptional()
    @IsIn(['createdAt', 'updatedAt', 'codigo', 'estado'])
    sortBy?: 'createdAt' | 'updatedAt' | 'codigo' | 'estado';

    @ApiPropertyOptional({ description: 'Dirección', enum: ['ASC', 'DESC'], example: 'DESC' })
    @Transform(({ value }) => (value === 'ASC' ? 'ASC' : 'DESC'))
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}