import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { UUID } from 'crypto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    users.map((user: User) => {
      delete user.password;
      return user;
    });
    return users;
  }

  async findOne(id: UUID) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    delete user.password;

    return user;
  }

  async update(id: UUID, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
    delete user.password;
    return user;
  }

  async remove(id: UUID) {
    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });
    delete user.password;
    return user;
  }
}
