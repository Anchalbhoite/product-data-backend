import { Entity, PrimaryGeneratedColumn, Column,OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Review } from '../review/review.entity';

@Entity()
export class ProductDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  specs: Record<string, any>;

  @Column({ type: 'float', nullable: true })
  ratingsAvg: number;

  @Column({ default: 0 })
  reviewsCount: number;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  publicationDate: string;

  @Column({ nullable: true })
  isbn: string;

  @OneToOne(() => Product, product => product.detail)
product: Product;

@OneToMany(() => Review, review => review.product)
reviews: Review[];

}
