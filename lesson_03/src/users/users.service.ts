import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    
    async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
        if (role) {
            const roleArray = await this.userRepository.find({ where: { role } });
            if(roleArray.length === 0){
                throw new NotFoundException('The asked role is not found');
            }
            return roleArray;
        }
        return await this.userRepository.find();
    }    

    async find(id: number) {
        const user = await this.userRepository.findOne({ where: { id } });

        if(!user){
            throw new NotFoundException(`User with id:${id} not found`)
        }

        return user;
    }

    async create(user: CreateUserDto) {
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    async update(id: number, updatedUser: UpdateUserDto) {
        await this.userRepository.update(id, updatedUser);
        return this.find(id);
    }
    
    async delete(id: number) {
        const removedUser = await this.userRepository.findOne({ where: { id } });
        if (!removedUser) return null;
        
        await this.userRepository.delete(id);
        return removedUser;
    }

}
