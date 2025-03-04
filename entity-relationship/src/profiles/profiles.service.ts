import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profiles.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(Profile)
    private readonly profilesRepo: Repository<Profile>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(userId: number, bio: string): Promise<Profile> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const profile = this.profilesRepo.create({ bio, user });
    return this.profilesRepo.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return this.profilesRepo.find({ relations: ['user'] });
  }

  async delete(id: number): Promise<void> {
    await this.profilesRepo.delete(id);
  }
}