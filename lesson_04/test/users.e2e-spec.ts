import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';


describe('Users E2E', () => {
    let app: INestApplication;
    let userRepository: Repository<User>;
  
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: ':memory:',
            entities: [User],
            synchronize: true,
          }),
          UsersModule,
        ],
      }).compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();

      userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    });
  
    beforeEach(async () => {
      await userRepository.clear();
    });
  
    afterAll(async () => {
      await app.close();
    });
  
    

    it('should create a user', async () => {
      const userDto = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'ENGINEER',
      };
    
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userDto);
    
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(userDto.name);
      expect(response.body.email).toBe(userDto.email);
    });


    it('should return all users', async () => {
      await userRepository.save({
        name: 'Test User',
        email: 'test@example.com',
        role: 'ENGINEER',
      });
    
      const response = await request(app.getHttpServer()).get('/users');
    
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });


    it('should return a single user', async () => {
      const user = await userRepository.save({
        name: 'Test User',
        email: 'test@example.com',
        role: 'ENGINEER',
      });
    
      const response = await request(app.getHttpServer()).get(`/users/${user.id}`);
    
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(user.id);
    });

    
    it('should update a user', async () => {
      const user = await userRepository.save({
        name: 'Old Name',
        email: 'old@example.com',
        role: 'INTERN',
      });
    
      const updatedUser = {
        name: 'New Name',
        email: 'new@example.com',
        role: 'ENGINEER',
      };
    
      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .send(updatedUser);
    
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedUser.name);
      expect(response.body.email).toBe(updatedUser.email);
    });

    
    it('should delete a user', async () => {
      const user = await userRepository.save({
        name: 'To Be Deleted',
        email: 'delete@example.com',
        role: 'ADMIN',
      });
    
      const response = await request(app.getHttpServer()).delete(`/users/${user.id}`);
    
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(user.id);
    });


    it('should return 400 when creating a user without a name', async () => {
      const response = await request(app.getHttpServer()).post('/users').send({ email: 'test@example.com', role: 'ENGINEER' });  
      expect(response.status).toBe(400);
    });


    it('should return 404 for non-existent user', async () => {
      const response = await request(app.getHttpServer()).get('/users/999');
      expect(response.status).toBe(404);
    });

  });