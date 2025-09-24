// backend/src/navigation/navigation.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Post()
  create(@Body() body: { title: string; slug: string }) {
    return this.navigationService.create(body.title, body.slug);
  }

   @Get()
  async findAll() {
    // returns all navigation headings
    return this.navigationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.navigationService.findOne(+id);
  }
}
