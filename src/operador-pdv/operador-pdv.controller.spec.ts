import { Test, TestingModule } from '@nestjs/testing';
import { OperadorPdvController } from './operador-pdv.controller';
import { OperadorPdvService } from './operador-pdv.service';

describe('OperadorPdvController', () => {
  let controller: OperadorPdvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperadorPdvController],
      providers: [OperadorPdvService],
    }).compile();

    controller = module.get<OperadorPdvController>(OperadorPdvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
