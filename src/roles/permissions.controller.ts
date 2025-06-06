import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crea un nuovo permesso' })
  @ApiResponse({ status: 201, description: 'Permesso creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Ottieni tutti i permessi' })
  @ApiResponse({ status: 200, description: 'Lista di permessi' })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Ottieni un permesso specifico' })
  @ApiResponse({ status: 200, description: 'Permesso trovato' })
  @ApiResponse({ status: 404, description: 'Permesso non trovato' })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Aggiorna un permesso' })
  @ApiResponse({ status: 200, description: 'Permesso aggiornato' })
  @ApiResponse({ status: 404, description: 'Permesso non trovato' })
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Elimina un permesso' })
  @ApiResponse({ status: 200, description: 'Permesso eliminato' })
  @ApiResponse({ status: 404, description: 'Permesso non trovato' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
