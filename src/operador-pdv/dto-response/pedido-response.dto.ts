import { ApiProperty } from '@nestjs/swagger';

class LineaPedidoResponseDto {
    @ApiProperty({ example: 'lp-uuid' })
    id!: string;

    @ApiProperty({ example: 'prod-uuid' })
    productoId!: string;

    @ApiProperty({ example: 2 })
    cantidad!: number;

    @ApiProperty({ example: '49.90' })
    precio_unitario_snapshot!: string;

    @ApiProperty({ example: '99.80' })
    subtotal_snapshot!: string;
}

export class PedidoResponseDto {
    @ApiProperty({ example: 'ped-uuid' })
    id!: string;

    @ApiProperty({ example: 'PED-2025-0001' })
    codigo!: string;

    @ApiProperty({ example: 'PENDIENTE' })
    estado!: string;

    @ApiProperty({ example: 'Notas u observaciones', nullable: true })
    notas!: string | null;

    @ApiProperty({ example: true })
    status!: boolean;

    @ApiProperty({ example: 'NOW' })
    createdAt!: string;

    @ApiProperty({ example: 'NOW' })
    updatedAt!: string;

    @ApiProperty({ example: 'user-uuid' })
    userId!: string | null;

    @ApiProperty({ example: 'pdv-uuid' })
    puntoVentaId!: string | null;

    @ApiProperty({ example: 'user-uuid' })
    createBy!: string;

    @ApiProperty({ type: [LineaPedidoResponseDto] })
    lineas!: LineaPedidoResponseDto[];
}