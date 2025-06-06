import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarBrandDto {
  @ApiProperty({ example: 'BMW', description: 'Nome della marca auto' })
  @IsString()
  @IsNotEmpty({ message: 'Nome della marca è obbligatorio' })
  name: string;
}
