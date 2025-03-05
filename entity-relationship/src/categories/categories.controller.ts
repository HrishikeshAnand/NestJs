import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { CategoriesService } from './categories.service';


@Controller('categories')
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.categoriesService.delete(id);
  }

  @Post(':categoryId/posts/:postId')
  assignPost(@Param('categoryId') categoryId: number, @Param('postId') postId: number) {
    return this.categoriesService.assignPostToCategory(categoryId, postId);
  }
}
