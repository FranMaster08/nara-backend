import { Injectable } from '@nestjs/common';
import { CreateOperadorPdvDto } from './dto/create-operador-pdv.dto';
import { UpdateOperadorPdvDto } from './dto/update-operador-pdv.dto';

@Injectable()
export class OperadorPdvService {
  create(createOperadorPdvDto: CreateOperadorPdvDto) {
    return 'This action adds a new operadorPdv';
  }

  findAll() {
    return `This action returns all operadorPdv`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operadorPdv`;
  }

  update(id: number, updateOperadorPdvDto: UpdateOperadorPdvDto) {
    return `This action updates a #${id} operadorPdv`;
  }

  remove(id: number) {
    return `This action removes a #${id} operadorPdv`;
  }
}
