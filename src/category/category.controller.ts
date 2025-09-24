// backend/src/category/category.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ProductService } from '../product/product.service';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService, // ✅ Injected here
  ) {}

  @Post()
  create(@Body() body: { title: string; slug: string; navigationId: number }) {
    return this.categoryService.create(body);
  }

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const category = await this.categoryService.findBySlug(slug);
    console.log("Looking up category with slug:", slug);
    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }
    return category;
  }

  // ✅ Correct route for products by category slug
  @Get(':slug/products')
async getProductsByCategory(@Param('slug') slug: string) {
  console.log("Looking up products for category slug:", slug); // debug log

  const products = await this.productService.findByCategorySlug(slug);

  if (!products || products.length === 0) {
    throw new NotFoundException('No products found for this category');
  }

  return products;
}


  @Get('navigation/:navigationId')
  findByNavigation(@Param('navigationId') navigationId: string) {
    return this.categoryService.findByNavigation(+navigationId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findOne(id);
  }
}
