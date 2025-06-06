import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crea un nuovo ruolo' })
  @ApiResponse({ status: 201, description: 'Ruolo creato con successo' })
  @ApiResponse({ status: 400, description: 'Dati non validi' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Ottieni tutti i ruoli' })
  @ApiResponse({ status: 200, description: 'Lista di ruoli' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Ottieni un ruolo specifico' })
  @ApiResponse({ status: 200, description: 'Ruolo trovato' })
  @ApiResponse({ status: 404, description: 'Ruolo non trovato' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Aggiorna un ruolo' })
  @ApiResponse({ status: 200, description: 'Ruolo aggiornato' })
  @ApiResponse({ status: 404, description: 'Ruolo non trovato' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Elimina un ruolo' })
  @ApiResponse({ status: 200, description: 'Ruolo eliminato' })
  @ApiResponse({ status: 404, description: 'Ruolo non trovato' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post(':roleId/permissions/:permissionId')
  @Roles('admin')
  @ApiOperation({ summary: 'Aggiungi un permesso a un ruolo' })
  @ApiResponse({ status: 200, description: 'Permesso aggiunto al ruolo' })
  @ApiResponse({ status: 404, description: 'Ruolo o permesso non trovato' })
  addPermissionToRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.addPermissionToRole(roleId, permissionId);
  }

  @Delete(':roleId/permissions/:permissionId')
  @Roles('admin')
  @ApiOperation({ summary: 'Rimuovi un permesso da un ruolo' })
  @ApiResponse({ status: 200, description: 'Permesso rimosso dal ruolo' })
  @ApiResponse({ status: 404, description: 'Ruolo o permesso non trovato' })
  removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rolesService.removePermissionFromRole(roleId, permissionId);
  }
}
