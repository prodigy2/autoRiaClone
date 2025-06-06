import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdsService } from './ads.service';
import { CreateCarAdDto } from './dto/create-car-ad.dto';
import { UpdateCarAdDto } from './dto/update-car-ad.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('ads')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea un nuovo annuncio' })
  @ApiResponse({ status: 201, description: 'Annuncio creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi o limite annunci raggiunto' })
  create(@Request() req, @Body() createCarAdDto: CreateCarAdDto) {
    return this.adsService.create(req.user.id, createCarAdDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ottieni tutti gli annunci attivi' })
  @ApiResponse({ status: 200, description: 'Lista di annunci' })
  findAll() {
    return this.adsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ottieni un annuncio specifico' })
  @ApiResponse({ status: 200, description: 'Annuncio trovato' })
  @ApiResponse({ status: 404, description: 'Annuncio non trovato' })
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aggiorna un annuncio' })
  @ApiResponse({ status: 200, description: 'Annuncio aggiornato' })
  @ApiResponse({ status: 404, description: 'Annuncio non trovato' })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateCarAdDto: UpdateCarAdDto,
  ) {
    return this.adsService.update(id, req.user.id, updateCarAdDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Elimina un annuncio' })
  @ApiResponse({ status: 200, description: 'Annuncio eliminato' })
  @ApiResponse({ status: 404, description: 'Annuncio non trovato' })
  remove(@Param('id') id: string, @Request() req) {
    return this.adsService.remove(id, req.user.id);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Incrementa il contatore visualizzazioni di un annuncio' })
  @ApiResponse({ status: 200, description: 'Contatore incrementato' })
  @ApiResponse({ status: 404, description: 'Annuncio non trovato' })
  incrementViews(@Param('id') id: string) {
    return this.adsService.incrementViews(id);
  }
}
