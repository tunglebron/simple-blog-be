import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UUID } from 'crypto';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as _ from 'lodash';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: {
          ...createCategoryDto,
        },
      });
      return category;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const duplicatedProperty = _.get(error, 'meta.target[0', 'Property');
          throw new BadRequestException(`${duplicatedProperty} already exists`);
        }
      }
      throw error;
    }
  }

  async findAll() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async findOne(id: UUID) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: id,
      },
    });
    return category;
  }

  async update(id: UUID, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        ...updateCategoryDto,
      },
    });
    return category;
  }

  async remove(id: UUID) {
    const category = await this.prisma.category.delete({
      where: {
        id: id,
      },
    });
    return category;
  }
}
