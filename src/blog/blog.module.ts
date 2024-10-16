import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
// import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
