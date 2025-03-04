import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './posts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
