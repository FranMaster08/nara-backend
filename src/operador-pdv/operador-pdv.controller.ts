import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OperadorPdvService } from './operador-pdv.service';
import { CreateOperadorPdvDto } from './dto/create-operador-pdv.dto';
import { UpdateOperadorPdvDto } from './dto/update-operador-pdv.dto';

@Controller('operador-pdv')
export class OperadorPdvController {
  constructor(private readonly operadorPdvService: OperadorPdvService) {}

  @Post()
  create(@Body() createOperadorPdvDto: CreateOperadorPdvDto) {
    return this.operadorPdvService.create(createOperadorPdvDto);
  }

  @Get()
  findAll() {
    return this.operadorPdvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operadorPdvService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOperadorPdvDto: UpdateOperadorPdvDto) {
    return this.operadorPdvService.update(+id, updateOperadorPdvDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operadorPdvService.remove(+id);
  }
}
