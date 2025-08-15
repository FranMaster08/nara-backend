import { Test, TestingModule } from '@nestjs/testing';
import { OperadorPdvService } from './operador-pdv.service';

describe('OperadorPdvService', () => {
  let service: OperadorPdvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperadorPdvService],
    }).compile();

    service = module.get<OperadorPdvService>(OperadorPdvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
