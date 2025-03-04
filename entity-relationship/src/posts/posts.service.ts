import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(postData: Partial<Post>, userId: number): Promise<Post> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const newPost = this.postsRepo.create({ ...postData, user });
    return this.postsRepo.save(newPost);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepo.find({ relations: ['user', 'categories'] });
  }

  async update(id: number, postData: Partial<Post>): Promise<void> {
    await this.postsRepo.update(id, postData);
  }

  async delete(id: number): Promise<void> {
    await this.postsRepo.delete(id);
  }
}