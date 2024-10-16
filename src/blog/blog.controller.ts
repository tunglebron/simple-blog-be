import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UUID } from 'crypto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller({
  version: '1',
  path: '/blog',
})
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: UUID,
    @Query('categoryId') categoryId?: UUID,
    @Query('pageIndex', new ParseIntPipe({ optional: true }))
    pageIndex: number = 1,
    @Query('pageSize', new ParseIntPipe({ optional: true }))
    pageSize: number = 20,
  ) {
    const skip = pageIndex > 1 ? (pageIndex - 1) * pageSize : 0;
    const take = pageSize > 0 ? pageSize : 20;
    return this.blogService.findAll(userId, categoryId, skip, take);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.blogService.remove(id);
  }
}
