//backend/src/scraping/scraping.module.ts
import { Module } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { NavigationModule } from '../navigation/navigation.module';

@Module({
  imports: [ProductModule, CategoryModule, NavigationModule],
  controllers: [ScrapingController],
  providers: [ScrapingService],
})
export class ScrapingModule {}
