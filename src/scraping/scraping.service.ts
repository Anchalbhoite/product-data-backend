import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { CategoryService } from '../category/category.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  /** Scrape categories from a navigation URL */
  async scrapeCategories(url: string, navigationId: number) {
    this.logger.log(`Scraping categories from ${url}`);

    const crawler = new PlaywrightCrawler({
      requestHandler: async ({ page }) => {
        // Adjust selector if needed
        const linksExist = await page.$('aside a');
        if (!linksExist) {
          this.logger.warn('No category links found on page');
          return;
        }

        const categories = await page.$$eval('aside a', links =>
          links.map(link => ({
            title: link.textContent?.trim() || '',
            url: link.getAttribute('href') || '',
          }))
        );

        for (const category of categories) {
          if (!category.title || !category.url) continue;

          const savedCategory = await this.categoryService.createOrUpdateCategory({
            title: category.title,
            slug: category.url.split('/').pop() || category.title.toLowerCase(),
            navigationId,
            lastScrapedAt: new Date(),
          });

          // Call product scraping for this category
          // await ScrapingService.scrapeProducts(category.url, savedCategory.id, this.productService);
        }
      },
    });

    await crawler.run([url]);
    this.logger.log('Category scraping finished');
  }

  /** Scrape products from a category page */
//   static async scrapeProducts(categoryUrl: string, categoryId: number, productService: ProductService) {
//   const logger = new Logger('ProductScraper');
//   logger.log(`Scraping products from ${categoryUrl}`);

//   const crawler = new PlaywrightCrawler({
//     async requestHandler({ page }) {
//       await page.waitForSelector('li.ais-InfiniteHits-item');

//       const products = await page.$$eval('li.ais-InfiniteHits-item', (items) =>
//         items.map(item => {
//           const linkEl = item.querySelector('a.product-card');
//           const title = linkEl?.textContent?.trim() || '';
//           const href = linkEl?.getAttribute('href') || '';
//           const sourceUrl = href.startsWith('http') ? href : `https://www.worldofbooks.com${href}`;

//           const priceEl = item.querySelector('div.price-item');
//           const price = priceEl?.textContent?.replace('£', '').trim() || '0';

//           const imgEl = item.querySelector('div.card__inner img');
//           const imageUrl = imgEl?.getAttribute('src') || '';

//           const authorEl = item.querySelector('p.author');
//           const author = authorEl?.textContent?.trim() || '';

//           return { title, author, price, currency: 'GBP', sourceUrl, imageUrl };
//         })
//       );

//       for (const product of products) {
//         if (!product.title || !product.sourceUrl) continue;

//         await productService.createOrUpdateProduct({
//           ...product,
//           categoryId,
//           lastScrapedAt: new Date(),
//         });
//       }

//       // Pagination
//       const nextButton = await page.$('a[rel="next"]');
//       if (nextButton) {
//         await nextButton.click();
//         await page.waitForTimeout(2000);
//         await this.requestHandler({ page });
//       }
//     },
//   });

//   await crawler.run([categoryUrl]);
//   logger.log('Products scraping finished');
// }

}
