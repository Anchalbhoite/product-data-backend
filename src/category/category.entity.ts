import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { Navigation } from '../navigation/navigation.entity';
import { Product } from '../product/product.entity';

@Entity()
@Unique(['slug', 'navigation'])
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    slug: string;

    @ManyToOne(() => Navigation, nav => nav.categories)
    navigation: Navigation;

    @Column({ nullable: true })
    parentId: number;

    @Column({ type: 'int', nullable: true })
    productCount: number;

    @Column({ type: 'timestamp', nullable: true })
    lastScrapedAt: Date;
    
    @OneToMany(() => Product, product => product.category)
products: Product[];


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
