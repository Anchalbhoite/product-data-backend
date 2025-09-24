// backend/src/navigation/navigation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './navigation.entity';

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
  ) {}

  async create(title: string, slug: string) {
    const nav = this.navigationRepository.create({ title, slug });
    return this.navigationRepository.save(nav);
  }
  async createOrUpdate(data: Partial<Navigation>) {
  return this.navigationRepository
    .createQueryBuilder()
    .insert()
    .into(Navigation)
    .values(data)
    .onConflict(`("slug") DO UPDATE SET title = :title`)
    .setParameter('title', data.title)
    .execute();
}


  // navigation.service.ts
async findAll() {
  const navs = await this.navigationRepository.find();
  return navs.map((nav) => ({
    id: nav.id,
    title: nav.title,
    slug: nav.slug,
    lastScrapedAt: nav.updatedAt, // ✅ alias
  }));
}


  async findOne(id: number) {
    const nav = await this.navigationRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!nav) throw new NotFoundException('Navigation not found');
    return nav;
  }
}
