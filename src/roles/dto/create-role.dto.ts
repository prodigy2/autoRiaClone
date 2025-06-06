import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', description: 'Nome del ruolo' })
  @IsString()
  @IsNotEmpty({ message: 'Nome del ruolo è obbligatorio' })
  name: string;

  @ApiProperty({ example: 'Amministratore del sistema', description: 'Descrizione del ruolo' })
  @IsString()
  @IsNotEmpty({ message: 'Descrizione del ruolo è obbligatoria' })
  description: string;
}
