import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UUID } from 'crypto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreateBlogDto) {
    const blog = await this.prisma.blog.create({
      data: {
        ...createPostDto,
      },
    });
    return blog;
  }

  async findAll(userId: UUID, categoryId: UUID, skip: number, take: number) {
    const where =
      userId || categoryId
        ? {
            OR: [{ ownerId: userId }, { categoryId: categoryId }],
          }
        : undefined;
    const blogs = await this.prisma.blog.findMany({
      skip: skip,
      take: take,
      where,
      orderBy: {
        createdDate: 'desc',
      },
    });
    return blogs;
  }

  async findOne(id: UUID) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        id: id,
      },
    });
    return blog;
  }

  async update(id: UUID, updatePostDto: UpdateBlogDto) {
    const blog = await this.prisma.blog.update({
      where: {
        id: id,
      },
      data: {
        ...updatePostDto,
        updatedDate: new Date(),
      },
    });
    return blog;
  }

  async remove(id: UUID) {
    const blog = await this.prisma.blog.delete({
      where: {
        id: id,
      },
    });
    return blog;
  }
}
