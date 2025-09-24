// backend/src/product/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { ProductDetail } from '../product-detail/product-detail.entity';
import { Review } from '../review/review.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  price: number;

  @Column()
  currency: string;

  @Column()
  imageUrl: string;

  @Column()
  sourceUrl: string;

  @Column({ type: 'timestamp', nullable: true })
  lastScrapedAt?: Date;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @OneToOne(() => ProductDetail, detail => detail.product, { cascade: true, nullable: true })
  @JoinColumn()
  detail?: ProductDetail[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];
}