import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Profile } from 'src/profiles/profiles.entity';
import { Post } from 'src/posts/posts.entity';

@Injectable()
export class UsersService {
    
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profilesRepo: Repository<Profile>,
    @InjectRepository(Post)
    private readonly postsRepo: Repository<Post>,
  ) {}


  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepo.create(user);
    return this.usersRepo.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepo.find({
      relations: ['posts', 'profile'],
    });
  }

  async update(id: number, user: Partial<User>): Promise<void> {
    await this.usersRepo.update(id, user);
  }
  
  async delete(id: number): Promise<void> {
    await this.usersRepo.delete(id);
  }
}