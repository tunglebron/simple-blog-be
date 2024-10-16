import { Injectable } from '@nestjs/common';
import { IDatabase } from './database.interface';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements IDatabase {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  async disconnect(): Promise<void> {
    await this.$disconnect();
  }

  async connect(): Promise<void> {
    await this.$connect();
  }
}
