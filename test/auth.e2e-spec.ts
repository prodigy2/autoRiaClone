import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/roles/entities/role.entity';
import { Permission } from '../src/roles/entities/permission.entity';
import * as bcrypt from 'bcrypt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository;
  let roleRepository;
  let permissionRepository;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(User));
    roleRepository = moduleFixture.get(getRepositoryToken(Role));
    permissionRepository = moduleFixture.get(getRepositoryToken(Permission));

    // Creare ruoli e permessi di base
    await setupInitialData();
  });

  async function setupInitialData() {
    // Creare permessi
    const readPermission = await permissionRepository.save({
      name: 'users:read',
      description: 'Permesso per leggere gli utenti',
    });

    const createPermission = await permissionRepository.save({
      name: 'users:create',
      description: 'Permesso per creare utenti',
    });

    // Creare ruoli
    const userRole = await roleRepository.save({
      name: 'user',
      description: 'Ruolo utente base',
      permissions: [readPermission],
    });

    const adminRole = await roleRepository.save({
      name: 'admin',
      description: 'Ruolo amministratore',
      permissions: [readPermission, createPermission],
    });

    // Creare utenti di test
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await userRepository.save({
      email: 'user@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      isActive: true,
      accountType: 'base',
      roles: [userRole],
    });

    await userRepository.save({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
      accountType: 'premium',
      roles: [adminRole],
    });
  }

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('/auth/login (POST) - should authenticate user and return JWT token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'password123' })
        .expect(200)
        .expect(res => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user).toBeDefined();
          expect(res.body.user.email).toEqual('user@example.com');
          jwtToken = res.body.access_token;
        });
    });

    it('/auth/register (POST) - should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
        })
        .expect(201)
        .expect(res => {
          expect(res.body.id).toBeDefined();
          expect(res.body.email).toEqual('newuser@example.com');
        });
    });
  });

  describe('Protected Routes', () => {
    it('/users (GET) - should require authentication', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('/users (GET) - should allow access with valid JWT', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });

  describe('Role-based Access Control', () => {
    it('/roles (GET) - should deny access to regular users', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'user@example.com', password: 'password123' });
      
      const userToken = loginResponse.body.access_token;

      return request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('/roles (GET) - should allow access to admin users', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'admin@example.com', password: 'password123' });
      
      const adminToken = loginResponse.body.access_token;

      return request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
