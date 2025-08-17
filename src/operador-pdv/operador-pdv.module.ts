// src/operador-pdv/operador-pdv.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OperadorPdvController } from './operador-pdv.controller';
import { OperadorPdvService } from './operador-pdv.service';
import { OperadorPdv } from './entities/operador-pdv.entity';
import { LoggerModule } from 'nestjs-pino';
import { LoggingModule } from 'src/logging/logging.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([OperadorPdv]),
     LoggerModule.forRoot(),          // <- solo si no lo iniciaste globalmente en AppModule
     LoggingModule,                   // <- si tienes un módulo propio que exporta PinoLogger
  ],
  controllers: [OperadorPdvController],
  providers: [OperadorPdvService],
  exports: [OperadorPdvService, TypeOrmModule], // útil si otros módulos consumen este repo/servicio
})
export class OperadorPdvModule {}