import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { PrismaService } from 'src/database/prisma.service';
import { hash, compare, genSalt } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthPayload } from './auth.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async hashPassword(password: string) {
    const saltRounds = Number(this.config.get<number>('SALT_ROUNDS'));
    const salt = await genSalt(saltRounds);
    return await hash(password, salt);
  }

  async signToken(payload: AuthPayload) {
    const token = await this.jwt.signAsync(payload);
    return {
      access_token: token,
    };
  }

  async authenticate(signInDto: SignInDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Credentials Incorrect');
    }
    const match = await compare(signInDto.password, user.password);
    if (!match) {
      throw new ForbiddenException('Credentials Incorrect');
    }
    delete user.password;

    return user;
  }

  async signIn(user: User) {
    return await this.signToken({
      id: user.id,
      email: user.email,
    });
  }

  async signUp(signUpDto: SignUpDto) {
    // hash password
    const hashedPassword = await this.hashPassword(signUpDto.password);
    signUpDto.password = hashedPassword;
    // save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          ...signUpDto,
        },
      });
      return await this.signToken({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
