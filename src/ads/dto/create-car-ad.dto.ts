import { IsNotEmpty, IsString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarAdDto {
  @ApiProperty({ example: 'BMW X5 in ottime condizioni', description: 'Titolo dell\'annuncio' })
  @IsString()
  @IsNotEmpty({ message: 'Titolo è obbligatorio' })
  title: string;

  @ApiProperty({ example: 'Vendo BMW X5 del 2019 con 50.000 km...', description: 'Descrizione dell\'annuncio' })
  @IsString()
  @IsNotEmpty({ message: 'Descrizione è obbligatoria' })
  description: string;

  @ApiProperty({ example: 25000, description: 'Prezzo dell\'auto' })
  @IsNumber()
  @IsNotEmpty({ message: 'Prezzo è obbligatorio' })
  @Min(0, { message: 'Il prezzo non può essere negativo' })
  price: number;

  @ApiProperty({ example: 'EUR', description: 'Valuta del prezzo', enum: ['USD', 'EUR', 'UAH'] })
  @IsEnum(['USD', 'EUR', 'UAH'], { message: 'Valuta non valida' })
  @IsNotEmpty({ message: 'Valuta è obbligatoria' })
  currency: 'USD' | 'EUR' | 'UAH';

  @ApiProperty({ example: 2019, description: 'Anno di produzione dell\'auto' })
  @IsNumber()
  @IsNotEmpty({ message: 'Anno è obbligatorio' })
  @Min(1900, { message: 'Anno non valido' })
  @Max(new Date().getFullYear(), { message: 'Anno non può essere nel futuro' })
  year: number;

  @ApiProperty({ example: 50000, description: 'Chilometraggio dell\'auto' })
  @IsNumber()
  @IsNotEmpty({ message: 'Chilometraggio è obbligatorio' })
  @Min(0, { message: 'Il chilometraggio non può essere negativo' })
  mileage: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID del modello auto' })
  @IsString()
  @IsNotEmpty({ message: 'ID del modello è obbligatorio' })
  modelId: string;
}
