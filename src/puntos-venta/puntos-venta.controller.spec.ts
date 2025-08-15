import { Test, TestingModule } from '@nestjs/testing';
import { PuntosVentaController } from './puntos-venta.controller';
import { PuntosVentaService } from './puntos-venta.service';

describe('PuntosVentaController', () => {
  let controller: PuntosVentaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuntosVentaController],
      providers: [PuntosVentaService],
    }).compile();

    controller = module.get<PuntosVentaController>(PuntosVentaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
