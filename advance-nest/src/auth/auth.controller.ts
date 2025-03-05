import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt.guard';
import { RequestWithUser } from './request.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    register(@Body() registerDto: RegisterDto){
        return this.authService.register(registerDto);
    }

    @Post('sign-in')
    async login(@Body() loginDto: LoginDto, @Res() res: Response){
        const {user, token} = await this.authService.login(loginDto);
        res.cookie('access_token', token, {httpOnly: true}).json(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: RequestWithUser){
        const response = req.user;
        const {password, ...remaining} = response;
        return remaining;
    }

    @Post('logout')
    logout(@Res() res: Response){
        res.clearCookie('access_token').json({message: 'Logged out successfully!'});
    }
}
