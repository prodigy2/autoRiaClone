import { PartialType } from '@nestjs/swagger';
import { CreateCarAdDto } from './create-car-ad.dto';

export class UpdateCarAdDto extends PartialType(CreateCarAdDto) {}
