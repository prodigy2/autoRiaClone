import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'users:create', description: 'Nome del permesso' })
  @IsString()
  @IsNotEmpty({ message: 'Nome del permesso è obbligatorio' })
  name: string;

  @ApiProperty({ example: 'Permesso per creare utenti', description: 'Descrizione del permesso' })
  @IsString()
  @IsNotEmpty({ message: 'Descrizione del permesso è obbligatoria' })
  description: string;
}
