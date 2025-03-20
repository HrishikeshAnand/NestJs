import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: { name: string; email: string }): Promise<User> {
    return this.usersService.createUser(body.name, body.email);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name: string; email: string },
  ): Promise<User> {
    return this.usersService.updateUser(+id, body.name, body.email);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(+id);
  }
}
