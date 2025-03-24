import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { AppModule } from './app.module';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  const userRepo = dataSource.getRepository(User);

  const users = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Doe', email: 'jane@example.com' },
  ];

  await userRepo.insert(users);
  console.log('Seeding completed');
  await app.close();
}

seed();
