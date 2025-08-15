import { PartialType } from '@nestjs/swagger';
import { CreateOperadorPdvDto } from './create-operador-pdv.dto';

export class UpdateOperadorPdvDto extends PartialType(CreateOperadorPdvDto) {}
