import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    return this.permissionsRepository.findOne({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Permission> {
    return this.permissionsRepository.findOne({
      where: { name },
    });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findOne(id);
    
    if (!permission) {
      throw new Error('Permesso non trovato');
    }
    
    Object.assign(permission, updatePermissionDto);
    
    return this.permissionsRepository.save(permission);
  }

  async remove(id: string): Promise<void> {
    await this.permissionsRepository.delete(id);
  }
}
