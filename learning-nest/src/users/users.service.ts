import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    
    async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
        if (role) {
            return await this.userRepository.find({ where: { role } });
        }
        return await this.userRepository.find();
    }    

    async find(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });

        return user;
    }

    async create(user: {name: string, email: string, role: 'INTERN' | 'ENGINEER' | 'ADMIN'}) {
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    async update(id: number, updatedUser: {name?: string, email?: string, role?: 'INTERN' | 'ENGINEER' | 'ADMIN'}) {
        await this.userRepository.update(id, updatedUser);
        return this.find(id);
    }
    
    // async delete(id: number) {
    //     const removedUser = await this.userRepository.findOne({ where: { id } });
    //     if (!removedUser) return null;
        
    //     await this.userRepository.delete(id);
    //     return removedUser;
    // }
    async delete(id: number) {
        const removedUser = await this.userRepository.findOneBy({ id });
        if (!removedUser) return null;
    
        await this.userRepository.delete(id);
        return removedUser;
    }
    
}
