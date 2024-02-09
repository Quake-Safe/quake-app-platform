import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { pagination } from 'prisma-extension-pagination';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  public readonly paginated;

  constructor() {
    super();
    this.paginated = this.$extends(
      pagination({
        pages: {
          includePageCount: true,
          limit: 10,
        },
      }),
    );
  }

  async onModuleInit() {
    await this.$connect();
  }
}
