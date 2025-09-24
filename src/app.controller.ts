import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
@Controller('navigation')
export class NavigationController {
  @Get()
  async getNavigation() {
    return [{ id: 1, title: 'Books' }, { id: 2, title: 'Children’s Books' }];
  }
}
