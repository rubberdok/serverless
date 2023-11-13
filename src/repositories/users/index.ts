import { Prisma, PrismaClient, User } from "@prisma/client";

export class UserRepository {
  constructor(private db: PrismaClient) {}

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.db.user.update({
      where: {
        id,
      },
      data,
    });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.db.user.create({
      data,
    });
  }

  getAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  get(id: string): Promise<User> {
    return this.db.user.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  getByFeideId(feideId: string): Promise<User> {
    return this.db.user.findFirstOrThrow({
      where: {
        feideId,
      },
    });
  }
}
