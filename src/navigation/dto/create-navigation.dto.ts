import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number; // ensure frontend sends a number

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;

  @IsNumber()
  categoryId: number; // must match database numeric type
}
