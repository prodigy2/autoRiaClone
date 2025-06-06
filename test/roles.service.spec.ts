import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../src/roles/roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../src/roles/entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto = {
        name: 'admin',
        description: 'Administrator role',
      };

      const role = {
        id: 'uuid',
        ...createRoleDto,
        permissions: [],
      };

      mockRepository.create.mockReturnValue(role);
      mockRepository.save.mockReturnValue(role);

      const result = await service.create(createRoleDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createRoleDto);
      expect(mockRepository.save).toHaveBeenCalledWith(role);
      expect(result).toEqual(role);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const roles = [
        {
          id: 'uuid1',
          name: 'admin',
          description: 'Administrator role',
          permissions: [],
        },
        {
          id: 'uuid2',
          name: 'user',
          description: 'Regular user role',
          permissions: [],
        },
      ];

      mockRepository.find.mockReturnValue(roles);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['permissions'],
      });
      expect(result).toEqual(roles);
    });
  });

  describe('findOne', () => {
    it('should return a role by id', async () => {
      const role = {
        id: 'uuid',
        name: 'admin',
        description: 'Administrator role',
        permissions: [],
      };

      mockRepository.findOne.mockReturnValue(role);

      const result = await service.findOne('uuid');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['permissions'],
      });
      expect(result).toEqual(role);
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      const role = {
        id: 'uuid',
        name: 'admin',
        description: 'Administrator role',
        permissions: [],
      };

      mockRepository.findOne.mockReturnValue(role);

      const result = await service.findByName('admin');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'admin' },
        relations: ['permissions'],
      });
      expect(result).toEqual(role);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      const role = {
        id: 'uuid',
        name: 'admin',
        description: 'Administrator role',
        permissions: [],
      };

      const updateRoleDto = {
        description: 'Updated administrator role',
      };

      const updatedRole = {
        ...role,
        ...updateRoleDto,
      };

      mockRepository.findOne.mockReturnValue(role);
      mockRepository.save.mockReturnValue(updatedRole);

      const result = await service.update('uuid', updateRoleDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['permissions'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...role,
        ...updateRoleDto,
      });
      expect(result).toEqual(updatedRole);
    });

    it('should throw an error if role not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.update('uuid', {})).rejects.toThrow('Ruolo non trovato');
    });
  });

  describe('remove', () => {
    it('should delete a role', async () => {
      await service.remove('uuid');

      expect(mockRepository.delete).toHaveBeenCalledWith('uuid');
    });
  });

  describe('addPermissionToRole', () => {
    it('should add a permission to a role', async () => {
      const role = {
        id: 'uuid',
        name: 'admin',
        description: 'Administrator role',
        permissions: [],
      };

      const updatedRole = {
        ...role,
        permissions: [{ id: 'permissionId' }],
      };

      mockRepository.findOne.mockReturnValue(role);
      mockRepository.save.mockReturnValue(updatedRole);

      const result = await service.addPermissionToRole('uuid', 'permissionId');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['permissions'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...role,
        permissions: [{ id: 'permissionId' }],
      });
      expect(result).toEqual(updatedRole);
    });

    it('should throw an error if role not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.addPermissionToRole('uuid', 'permissionId')).rejects.toThrow('Ruolo non trovato');
    });
  });

  describe('removePermissionFromRole', () => {
    it('should remove a permission from a role', async () => {
      const role = {
        id: 'uuid',
        name: 'admin',
        description: 'Administrator role',
        permissions: [
          { id: 'permissionId1' },
          { id: 'permissionId2' },
        ],
      };

      const updatedRole = {
        ...role,
        permissions: [{ id: 'permissionId1' }],
      };

      mockRepository.findOne.mockReturnValue(role);
      mockRepository.save.mockReturnValue(updatedRole);

      const result = await service.removePermissionFromRole('uuid', 'permissionId2');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['permissions'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...role,
        permissions: [{ id: 'permissionId1' }],
      });
      expect(result).toEqual(updatedRole);
    });

    it('should throw an error if role not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.removePermissionFromRole('uuid', 'permissionId')).rejects.toThrow('Ruolo non trovato');
    });
  });
});
