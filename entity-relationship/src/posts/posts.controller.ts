import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './posts.entity';

@Controller('posts')
export class PostsController {

    constructor(private readonly postsService: PostsService) {}

    @Post(':userId')
    create(@Body() postData: Partial<PostEntity>, @Param('userId') userId: number) {
      return this.postsService.create(postData, userId);
    }
  
    @Get()
    findAll() {
      return this.postsService.findAll();
    }
  
    @Patch(':id')
    update(@Param('id') id: number, @Body() postData: Partial<PostEntity>) {
      return this.postsService.update(id, postData);
    }
  
    @Delete(':id')
    delete(@Param('id') id: number) {
      return this.postsService.delete(id);
    }

}
