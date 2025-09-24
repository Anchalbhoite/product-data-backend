// backend/src/product/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Category } from '../category/category.entity';
import { ProductDetail } from '../product-detail/product-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductDetail]), // 👈 add ProductDetail here
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService], // if other modules need it
})
export class ProductModule {}
