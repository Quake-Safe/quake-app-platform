import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async createOne(input: Prisma.UserProfileCreateInput) {
    return this.db.userProfile.create({
      data: input,
    });
  }

  async updateOne({
    where,
    input,
  }: {
    where: Prisma.UserProfileWhereUniqueInput;
    input: Prisma.UserProfileUpdateInput;
  }) {
    return this.db.userProfile.update({
      data: input,
      where,
    });
  }

  async findOne(where: Prisma.UserProfileWhereUniqueInput) {
    return this.db.userProfile.findUnique({
      where,
    });
  }
}
