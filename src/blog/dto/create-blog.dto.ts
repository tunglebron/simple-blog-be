import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';
import { Blog } from '../entities/blog.entity';

export class CreateBlogDto extends Blog {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: UUID;

  @IsUUID()
  @IsNotEmpty()
  ownerId: UUID;

  @IsNotEmpty()
  @IsNotEmpty()
  abstract: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  author: string;

  tags: string[];

  views: number = 0;

  likes: number = 0;

  createdDate: Date = new Date();

  updatedDate: Date = new Date();
}
