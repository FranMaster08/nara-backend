// src/puntos-venta/dto-responses/puntos-venta-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PuntosVentaResponseDto {
    @ApiProperty({ example: 'pv-uuid' })
    id!: string;

    @ApiProperty({ example: 'Sucursal Centro' })
    name!: string;

    @ApiProperty({ example: 'Av. Siempre Viva 742' })
    address!: string;

    @ApiProperty({ example: '+54 11 1234-5678' })
    phone!: string;

    @ApiProperty({ example: '-34.6037' })
    lat!: string;

    @ApiProperty({ example: '-58.3816' })
    lng!: string;

    @ApiProperty({ example: true })
    status!: boolean;

    @ApiProperty({ example: 'NOW' })
    createdAt!: string;

    @ApiProperty({ example: 'NOW' })
    updatedAt!: string;
}