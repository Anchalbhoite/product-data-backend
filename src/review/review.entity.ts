import { Entity, PrimaryGeneratedColumn, Column, OneToMany,ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, product => product.reviews)
product: Product;

  @Column({nullable: true})
  author: string;

  @Column()
  rating: number;

  @Column('text')
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Review, review => review.product)
reviews: Review[];
}
