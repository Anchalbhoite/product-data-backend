import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NavigationModule } from './navigation/navigation.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ReviewModule } from './review/review.module';
import { ScrapingController } from './scraping/scraping.controller';
import { ScrapingService } from './scraping/scraping.service';
console.log('DATABASE_PASSWORD (raw):', process.env.DATABASE_PASSWORD);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Explicitly load .env
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
  const password = String(configService.get('DATABASE_PASSWORD'));

  console.log('Database Config:', {
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: password,
    database: configService.get('DATABASE_NAME'),
  });

  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: Number(configService.get<number>('DATABASE_PORT')),
    username: configService.get<string>('DATABASE_USER'),
    password: password, // ✅ casted password here
    database: configService.get<string>('DATABASE_NAME'),
    autoLoadEntities: true,
    synchronize: true,
  };
}

    }),

    NavigationModule,
    CategoryModule,
    ProductModule,
    ReviewModule,
  ],
  controllers: [ScrapingController],
  providers: [ScrapingService],
  
})

export class AppModule {}
