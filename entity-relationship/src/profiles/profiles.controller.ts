import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {

    constructor(private readonly profilesService: ProfilesService) {}

    @Post()
    create(@Body() body: { userId: number; bio: string }) {
      return this.profilesService.create(body.userId, body.bio);
    }
  
    @Get()
    findAll() {
      return this.profilesService.findAll();
    }
    
    @Delete(':id')
    delete(@Param('id') id: number) {
      return this.profilesService.delete(id);
    }
}