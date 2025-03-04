import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() user: Partial<User>) {
        return this.usersService.create(user);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() user: Partial<User>) {
        return this.usersService.update(id, user);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.usersService.delete(id);
    }
}
