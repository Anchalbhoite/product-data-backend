//backend/src/scraping/scraping.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ScrapingService } from './scraping.service';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

 @Post('category')
async scrapeCategory(
  @Body('url') categoryUrl: string,
  @Body('navigationId') navigationId: number,
) {
  if (!categoryUrl || !navigationId) {
    return { message: 'Category URL and navigationId are required' };
  }

  await this.scrapingService.scrapeCategories(categoryUrl, navigationId);
  return { message: `Scraping started for navigationId ${navigationId}` };
}



}
