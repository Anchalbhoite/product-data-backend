// backend/src/category/category.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Navigation } from '../navigation/navigation.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Navigation)
    private readonly navRepo: Repository<Navigation>,
  ) {}

  // Create a category under a navigation
  async create(data: { title: string; slug: string; navigationId: number }) {
    const { title, slug, navigationId } = data;

    if (!navigationId || isNaN(navigationId)) {
      throw new BadRequestException('Invalid navigationId');
    }

    const navigation = await this.navRepo.findOne({
      where: { id: navigationId },
    });

    if (!navigation) throw new NotFoundException('Navigation not found');

    const category = this.categoryRepo.create({
      title,
      slug,
      navigation,
    });

    return this.categoryRepo.save(category);
  }

  // Create or update category
  async createOrUpdateCategory(data: {
    title: string;
    slug: string;
    navigationId: number;
    parentId?: number;
    lastScrapedAt: Date;
  }) {
    if (!data.navigationId || isNaN(data.navigationId)) {
      throw new BadRequestException('Invalid navigationId');
    }

    const navigation = await this.navRepo.findOneBy({ id: data.navigationId });
    if (!navigation) throw new NotFoundException('Navigation not found');

    let category = await this.categoryRepo.findOne({
      where: { slug: data.slug, navigation: { id: data.navigationId } },
    });

    if (category) {
      category.lastScrapedAt = data.lastScrapedAt;
      return this.categoryRepo.save(category);
    }

    category = this.categoryRepo.create({
      title: data.title,
      slug: data.slug,
      navigation,
      parentId: data.parentId,
      lastScrapedAt: data.lastScrapedAt,
    });

    return this.categoryRepo.save(category);
  }

  // Get categories by navigation id
  async getCategoriesByNavigation(navigationId: number) {
    if (!navigationId || isNaN(navigationId)) {
      throw new BadRequestException('Invalid navigationId');
    }

    return this.categoryRepo.find({
      where: { navigation: { id: navigationId } },
    });
  }

  // Get products by category slug
  async getProductsBySlug(slug: string) {
    if (!slug) throw new BadRequestException('Slug is required');

    const category = await this.categoryRepo.findOne({
      where: { slug },
      relations: ['products'],
    });

    if (!category) throw new NotFoundException('Category not found');

    const products = (category.products || []).map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    return {
      products,
      total: products.length,
      page: 1,
      limit: 12,
      totalPages: 1,
    };
  }

  // Get all categories
  async findAll() {
    const categories = await this.categoryRepo.find({
      relations: ['navigation', 'products'],
    });

    return categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      slug: cat.slug,
      productCount: cat.products ? cat.products.length : 0,
      lastScrapedAt: cat.lastScrapedAt || cat.updatedAt,
      navigation: cat.navigation,
    }));
  }

  // Find category by slug
  async findBySlug(slug: string) {
    if (!slug) throw new BadRequestException('Slug is required');

    const category = await this.categoryRepo.findOne({
      where: { slug },
      relations: ['navigation', 'products'],
    });

    if (!category) throw new NotFoundException('Category not found');

    return {
      ...category,
      productCount: category.products ? category.products.length : 0,
      lastScrapedAt: category.updatedAt,
      products: category.products?.map((product) => ({
        ...product,
        price: Number(product.price),
      })),
    };
  }

  // Find categories by navigation id
  async findByNavigation(navigationId: number) {
    if (!navigationId || isNaN(navigationId)) {
      throw new BadRequestException('Invalid navigationId');
    }

    const categories = await this.categoryRepo.find({
      where: { navigation: { id: navigationId } },
      relations: ['navigation', 'products'],
    });

    return categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      slug: cat.slug,
      productCount: cat.products ? cat.products.length : 0,
      lastScrapedAt: cat.updatedAt,
      navigation: cat.navigation,
    }));
  }

  // Find one category by id
  async findOne(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid category id');
    }

    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['navigation', 'products'],
    });

    if (!category) throw new NotFoundException('Category not found');

    return {
      ...category,
      productCount: category.products ? category.products.length : 0,
      lastScrapedAt: category.updatedAt,
    };
  }
}
