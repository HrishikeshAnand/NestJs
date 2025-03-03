import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private jwtService: JwtService
    ){}

    async register(registerDto: RegisterDto){
        const {email, password} = registerDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({email, password: hashedPassword})
        await this.userRepo.save(user);
        return {message: 'User registered successfully!'};
    }

    async login(loginDto: LoginDto){
        const user = await this.userRepo.findOne({where: {email: loginDto.email}});
        if(!user || !(await bcrypt.compare(loginDto.password, user.password))){
            throw new UnauthorizedException('Invalid credentials');
        }
        const token = this.jwtService.sign({id: user.id});
        return {user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        token};
    }
}
