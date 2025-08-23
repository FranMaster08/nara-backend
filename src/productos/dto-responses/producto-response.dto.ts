import { ApiProperty } from '@nestjs/swagger';

export class ProductoResponseDto {
    @ApiProperty({ example: 'e8b8c2e0-2b8f-4bff-923f-1d6d1a4b7a99' })
    id!: string;

    @ApiProperty({ example: 'Teclado mecánico 60%' })
    nombre!: string;

    @ApiProperty({ example: '49.90', description: 'numeric como string' })
    precio_unitario!: string;

    @ApiProperty({ example: 'SKU-TECLADO-60P-NEGRO', nullable: true })
    sku?: string | null;

    @ApiProperty({ example: true })
    status!: boolean;

    @ApiProperty({ example: '2025-08-15T16:20:00.000Z' })
    createdAt!: Date;

    @ApiProperty({ example: '2025-08-15T16:20:00.000Z' })
    updatedAt!: Date;
}