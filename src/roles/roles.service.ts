import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['permissions'],
    });
  }

  async findOne(id: string): Promise<Role> {
    return this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async findByName(name: string): Promise<Role> {
    return this.rolesRepository.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    
    if (!role) {
      throw new Error('Ruolo non trovato');
    }
    
    Object.assign(role, updateRoleDto);
    
    return this.rolesRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    await this.rolesRepository.delete(id);
  }

  async addPermissionToRole(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    
    if (!role) {
      throw new Error('Ruolo non trovato');
    }
    
    // Aggiungiamo il permesso al ruolo
    role.permissions.push({ id: permissionId } as any);
    
    return this.rolesRepository.save(role);
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    
    if (!role) {
      throw new Error('Ruolo non trovato');
    }
    
    // Rimuoviamo il permesso dal ruolo
    role.permissions = role.permissions.filter(permission => permission.id !== permissionId);
    
    return this.rolesRepository.save(role);
  }
}
