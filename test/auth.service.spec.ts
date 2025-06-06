import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user with correct credentials', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        accountType: 'base' as 'base' | 'premium',
        roles: [],
        ads: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'password');

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(result).toEqual({
        id: 'uuid',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        accountType: 'base' as 'base' | 'premium',
        roles: [],
        ads: [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    });

    it('should return null for invalid credentials', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null for incorrect password', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        isActive: true,
        accountType: 'base' as 'base' | 'premium',
        roles: [],
        ads: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => Promise.resolve(false));

      const result = await service.validateUser('test@example.com', 'wrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate a JWT token for a user', async () => {
      const user = {
        id: 'uuid',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        accountType: 'base' as 'base' | 'premium',
        roles: [
          {
            name: 'user',
            permissions: [
              { name: 'read:profile' },
              { name: 'update:profile' },
            ],
          },
        ],
      };

      const token = 'jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'uuid',
        roles: ['user'],
        permissions: ['read:profile', 'update:profile'],
      });

      expect(result).toEqual({
        access_token: token,
        user: {
          id: 'uuid',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          accountType: 'base' as 'base' | 'premium',
          roles: ['user'],
        },
      });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
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
        isActive: true,
        accountType: 'base' as 'base' | 'premium',
        roles: [],
        ads: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(user);

      const result = await service.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(user);
    });
  });
});
