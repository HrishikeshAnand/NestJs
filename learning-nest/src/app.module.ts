import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Hrishikesh12',
      database: 'translense',
      autoLoadEntities: true,
      synchronize: true
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
