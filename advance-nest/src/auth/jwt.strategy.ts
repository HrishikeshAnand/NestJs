import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies?.access_token]),
      secretOrKey: 'JWT_SECRET'
    });
  }

  async validate(payload: any) {
    return this.userRepo.findOne({ where: { id: payload.id } });
  }
}
