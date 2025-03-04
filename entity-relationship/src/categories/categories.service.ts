import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories.entity';
import { Post } from 'src/posts/posts.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category) private categoriesRepo: Repository<Category>,
    @InjectRepository(Post) private postsRepo: Repository<Post>,
  ) {}

  async create(name: string): Promise<Category> {
    const category = this.categoriesRepo.create({ name });
    return this.categoriesRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepo.find({ relations: ['posts'] });
  }


  async delete(id: number): Promise<void> {
    await this.categoriesRepo.delete(id);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepo.findOne({ where: { id }, relations: ['posts'] });
    
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
  
    return category;
  }
  

  async assignPostToCategory(categoryId: number, postId: number): Promise<Category> {
    const category = await this.findOne(categoryId);
    const post = await this.postsRepo.findOne({ where: { id: postId } });

    if (!category || !post) throw new Error('Category or Post not found');

    category.posts = [...category.posts, post];
    return this.categoriesRepo.save(category);
  }
}