import { Test, TestingModule } from '@nestjs/testing';
import { PuntosVentaService } from './puntos-venta.service';

describe('PuntosVentaService', () => {
  let service: PuntosVentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuntosVentaService],
    }).compile();

    service = module.get<PuntosVentaService>(PuntosVentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
