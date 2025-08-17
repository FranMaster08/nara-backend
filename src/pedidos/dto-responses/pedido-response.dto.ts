// src/pedidos/dto-responses/pedido-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LineaPedidoResponseDto {
    @ApiProperty({ description: 'ID de la línea', example: 'linea-uuid' })
    id: string;

    @ApiProperty({ description: 'ID del producto asociado', example: 'prod-123' })
    productoId: string;

    @ApiProperty({ description: 'Cantidad solicitada', example: 3 })
    cantidad: number;

    @ApiProperty({
        description: 'Precio unitario snapshot al momento del pedido',
        example: 1200.5,
        nullable: true,
    })
    precioUnitarioSnapshot: number | null;

    @ApiProperty({
        description: 'Subtotal snapshot (cantidad * precio)',
        example: 3601.5,
        nullable: true,
    })
    subtotalSnapshot: number | null;
}

export class PedidoResponseDto {
    @ApiProperty({ description: 'ID del pedido', example: 'ped-uuid' })
    id: string;

    @ApiProperty({ description: 'Código del pedido', example: 'PED-2025-0001' })
    codigo: string;

    @ApiProperty({
        description: 'Estado del pedido',
        example: 'PENDIENTE',
    })
    estado: string;

    @ApiProperty({
        description: 'Notas adicionales',
        example: 'Entrega urgente',
        nullable: true,
    })
    notas: string | null;

    @ApiProperty({ description: 'Estatus activo/inactivo', example: true })
    status: boolean;

    @ApiProperty({
        description: 'Fecha de creación',
        example: '2025-08-17T10:30:00Z',
    })
    createdAt: string;

    @ApiProperty({
        description: 'Fecha de actualización',
        example: '2025-08-17T11:00:00Z',
    })
    updatedAt: string;

    @ApiProperty({ description: 'Usuario que creó el pedido', example: 'user-uuid' })
    createBy: string;

    @ApiProperty({ description: 'ID del usuario dueño del pedido', example: 'user-uuid' })
    userId: string;

    @ApiProperty({ description: 'ID del punto de venta', example: 'pdv-uuid' })
    puntoVentaId: string;

    @ApiProperty({
        description: 'Líneas del pedido',
        type: [LineaPedidoResponseDto],
    })
    lineas: LineaPedidoResponseDto[];
}