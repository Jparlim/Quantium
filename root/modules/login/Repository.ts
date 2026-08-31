import { Prisma } from "../../infra/database/client.js";

export class RepositoryLogin {
  async findUserByEmail(email: string) {
    return await Prisma.company.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findAdminByEmail(email: string) {
    return await Prisma.admin.findUnique({
      where: {
        email: email,
      },
    });
  }
}
