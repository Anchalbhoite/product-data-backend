// backend/src/product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';
import { ProductDetail } from '../product-detail/product-detail.entity';
import { ILike } from 'typeorm';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(ProductDetail)
    private detailRepository: Repository<ProductDetail>,
  ) {}



  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category', 'detail'] });
  }

   async createOrUpdateProduct(data: {
  title: string;
  price: string;
  currency: string;
  sourceUrl: string;
  imageUrl: string;
  categoryId: number;
  lastScrapedAt: Date;
}) {
  let product = await this.productRepository.findOne({
    where: { sourceUrl: data.sourceUrl },
  });

  if (product) {
    product.price = Number(data.price);
    product.lastScrapedAt = data.lastScrapedAt;
    return this.productRepository.save(product);
  }

  const { categoryId, ...rest } = data;
  product = this.productRepository.create({
    ...rest,
    price: Number(data.price),
  });
  return this.productRepository.save(product);
}

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'detail'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['category', 'detail'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findByCategorySlug(slug: string): Promise<Product[]> {
    console.log("Looking up category for slug:", slug);
    const category = await this.categoryRepository.findOne({
      where: { slug: ILike(slug) },
      relations: ['products']
    });
    if (!category) throw new NotFoundException('Category not found');
    return this.productRepository.find({
      where: { category: { id: category.id } },
      relations: ['category', 'detail'],
    });
  }

  async create(data: any): Promise<Product> {
  // Find category
  const category = await this.categoryRepository.findOne({
    where: { id: data.categoryId },
  });
  if (!category) throw new NotFoundException('Category not found');

  // Create product entity
  const product = this.productRepository.create({
    title: data.title,
    slug: data.slug,
    price: data.price,
    currency: data.currency,
    imageUrl: data.imageUrl,
    sourceUrl: data.sourceUrl,
    category,
  });

  // Save product first so it has an ID
  const savedProduct = await this.productRepository.save(product);

  // If product detail provided, create and attach it
  if (data.detail) {
    const detail = this.detailRepository.create({
      ...data.detail,
      product: savedProduct, // ✅ link the product
    });
    await this.detailRepository.save(detail);
    savedProduct.detail = detail;
  }

  return savedProduct;
}


  async update(id: number, data: any): Promise<Product> {
    const product = await this.findOne(id);

    if (data.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: data.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      product.category = category;
    }

    Object.assign(product, data);

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
