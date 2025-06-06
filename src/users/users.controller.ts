import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crea un nuovo utente' })
  @ApiResponse({ status: 201, description: 'Utente creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ottieni tutti gli utenti' })
  @ApiResponse({ status: 200, description: 'Lista di utenti' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ottieni un utente specifico' })
  @ApiResponse({ status: 200, description: 'Utente trovato' })
  @ApiResponse({ status: 404, description: 'Utente non trovato' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aggiorna un utente' })
  @ApiResponse({ status: 200, description: 'Utente aggiornato' })
  @ApiResponse({ status: 404, description: 'Utente non trovato' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Elimina un utente' })
  @ApiResponse({ status: 200, description: 'Utente eliminato' })
  @ApiResponse({ status: 404, description: 'Utente non trovato' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/premium')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aggiorna un utente a premium' })
  @ApiResponse({ status: 200, description: 'Utente aggiornato a premium' })
  @ApiResponse({ status: 404, description: 'Utente non trovato' })
  upgradeToPremiun(@Param('id') id: string) {
    return this.usersService.upgradeToPremiun(id);
  }
}
