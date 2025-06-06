import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarBrandDto } from './dto/create-car-brand.dto';
import { CreateCarModelDto } from './dto/create-car-model.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post('brands')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea una nuova marca auto' })
  @ApiResponse({ status: 201, description: 'Marca creata con successo' })
  createBrand(@Body() createCarBrandDto: CreateCarBrandDto) {
    return this.carsService.createBrand(createCarBrandDto);
  }

  @Get('brands')
  @ApiOperation({ summary: 'Ottieni tutte le marche auto' })
  @ApiResponse({ status: 200, description: 'Lista di marche auto' })
  findAllBrands() {
    return this.carsService.findAllBrands();
  }

  @Get('brands/:id')
  @ApiOperation({ summary: 'Ottieni una marca auto specifica' })
  @ApiResponse({ status: 200, description: 'Marca auto trovata' })
  @ApiResponse({ status: 404, description: 'Marca auto non trovata' })
  findBrandById(@Param('id') id: string) {
    return this.carsService.findBrandById(id);
  }

  @Post('brands/:brandId/models')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea un nuovo modello auto' })
  @ApiResponse({ status: 201, description: 'Modello creato con successo' })
  createModel(
    @Param('brandId') brandId: string,
    @Body() createCarModelDto: CreateCarModelDto,
  ) {
    return this.carsService.createModel(brandId, createCarModelDto);
  }

  @Get('models')
  @ApiOperation({ summary: 'Ottieni tutti i modelli auto' })
  @ApiResponse({ status: 200, description: 'Lista di modelli auto' })
  findAllModels() {
    return this.carsService.findAllModels();
  }

  @Get('models/:id')
  @ApiOperation({ summary: 'Ottieni un modello auto specifico' })
  @ApiResponse({ status: 200, description: 'Modello auto trovato' })
  @ApiResponse({ status: 404, description: 'Modello auto non trovato' })
  findModelById(@Param('id') id: string) {
    return this.carsService.findModelById(id);
  }

  @Get('brands/:brandId/models')
  @ApiOperation({ summary: 'Ottieni tutti i modelli di una marca specifica' })
  @ApiResponse({ status: 200, description: 'Lista di modelli auto' })
  findModelsByBrand(@Param('brandId') brandId: string) {
    return this.carsService.findModelsByBrand(brandId);
  }
}
