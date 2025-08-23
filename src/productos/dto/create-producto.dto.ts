import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    Matches,
} from 'class-validator';


const nullishToUndef = ({ value }: { value: any }) =>
    value === null || value === '' ? undefined : value;

const DECIMAL_RE = /^(?:\d+)(?:\.\d+)?$/;
export class CreateProductoDto {

    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Teclado mecánico 60%',
        maxLength: 200,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    nombre!: string;

    @ApiProperty({
        description: 'Precio unitario como string decimal (columna numeric)',
        example: '49.90',
    })
    @IsString()
    @Matches(DECIMAL_RE, { message: 'precio_unitario debe ser decimal válido' })
    precio_unitario!: string;

    @ApiPropertyOptional({
        description: 'SKU único (opcional)',
        example: 'SKU-TECLADO-60P-NEGRO',
        maxLength: 120,
    })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsString()
    @MaxLength(120)
    sku?: string;

    @ApiPropertyOptional({
        description: 'Estatus del producto',
        example: true,
        default: true,
    })
    @Transform(nullishToUndef)
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}