import { Controller, Get, Param } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getAll() {
    return this.reviewService.findAll();
  }

  @Get('product/:id')
  getByProduct(@Param('id') id: number) {
    return this.reviewService.findByProduct(id);
  }
}
