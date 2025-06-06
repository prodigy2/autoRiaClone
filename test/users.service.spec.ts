import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
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
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = {
        id: 'uuid',
        ...createUserDto,
        password: 'hashedPassword',
        isActive: false,
        accountType: 'base',
        roles: [],
        ads: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(user);

      const result = await service.create(createUserDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        {
          id: 'uuid1',
          email: 'test1@example.com',
          firstName: 'Test1',
          lastName: 'User1',
        },
        {
          id: 'uuid2',
          email: 'test2@example.com',
          firstName: 'Test2',
          lastName: 'User2',
        },
      ];

      mockRepository.find.mockReturnValue(users);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['roles', 'ads'],
      });
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      mockRepository.findOne.mockReturnValue(user);

      const result = await service.findOne('uuid');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['roles', 'ads'],
      });
      expect(result).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      mockRepository.findOne.mockReturnValue(user);

      const result = await service.findByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        relations: ['roles', 'roles.permissions'],
      });
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const updateUserDto = {
        firstName: 'Updated',
      };

      const updatedUser = {
        ...user,
        ...updateUserDto,
      };

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.save.mockReturnValue(updatedUser);

      const result = await service.update('uuid', updateUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['roles', 'ads'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...user,
        ...updateUserDto,
      });
      expect(result).toEqual(updatedUser);
    });

    it('should hash password if provided', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const updateUserDto = {
        password: 'newPassword',
      };

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.save.mockReturnValue({
        ...user,
        password: 'hashedPassword',
      });

      await service.update('uuid', updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...user,
        password: 'hashedPassword',
      });
    });

    it('should throw an error if user not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.update('uuid', {})).rejects.toThrow('Utente non trovato');
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      await service.remove('uuid');

      expect(mockRepository.delete).toHaveBeenCalledWith('uuid');
    });
  });

  describe('upgradeToPremiun', () => {
    it('should upgrade user to premium', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        accountType: 'base',
      };

      const upgradedUser = {
        ...user,
        accountType: 'premium',
      };

      mockRepository.findOne.mockReturnValue(user);
      mockRepository.save.mockReturnValue(upgradedUser);

      const result = await service.upgradeToPremiun('uuid');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['roles', 'ads'],
      });
      expect(mockRepository.save).toHaveBeenCalledWith({
        ...user,
        accountType: 'premium',
      });
      expect(result).toEqual(upgradedUser);
    });

    it('should throw an error if user not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.upgradeToPremiun('uuid')).rejects.toThrow('Utente non trovato');
    });
  });

  describe('countUserAds', () => {
    it('should return the number of ads for a user', async () => {
      const user = {
        id: 'uuid',
        ads: [{}, {}, {}],
      };

      mockRepository.findOne.mockReturnValue(user);

      const result = await service.countUserAds('uuid');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid' },
        relations: ['ads'],
      });
      expect(result).toEqual(3);
    });

    it('should return 0 if user not found', async () => {
      mockRepository.findOne.mockReturnValue(null);

      const result = await service.countUserAds('uuid');

      expect(result).toEqual(0);
    });
  });
});
