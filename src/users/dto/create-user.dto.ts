import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email dell\'utente' })
  @IsEmail({}, { message: 'Email non valida' })
  @IsNotEmpty({ message: 'Email è obbligatoria' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Password dell\'utente' })
  @IsString()
  @MinLength(8, { message: 'La password deve essere di almeno 8 caratteri' })
  @IsNotEmpty({ message: 'Password è obbligatoria' })
  password: string;

  @ApiProperty({ example: 'Mario', description: 'Nome dell\'utente' })
  @IsString()
  @IsNotEmpty({ message: 'Nome è obbligatorio' })
  firstName: string;

  @ApiProperty({ example: 'Rossi', description: 'Cognome dell\'utente' })
  @IsString()
  @IsNotEmpty({ message: 'Cognome è obbligatorio' })
  lastName: string;
}
