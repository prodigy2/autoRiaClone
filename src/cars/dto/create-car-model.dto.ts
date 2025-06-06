import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarModelDto {
  @ApiProperty({ example: 'X5', description: 'Nome del modello auto' })
  @IsString()
  @IsNotEmpty({ message: 'Nome del modello è obbligatorio' })
  name: string;
}
