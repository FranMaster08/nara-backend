import { Module } from '@nestjs/common';
import { OperadorPdvService } from './operador-pdv.service';
import { OperadorPdvController } from './operador-pdv.controller';

@Module({
  controllers: [OperadorPdvController],
  providers: [OperadorPdvService],
})
export class OperadorPdvModule {}
