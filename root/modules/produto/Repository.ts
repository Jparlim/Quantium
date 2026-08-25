import { ExecutionStepPage } from "twilio/lib/rest/studio/v1/flow/execution/executionStep.js";
import { Prisma } from "../../infra/database/client.js";
import {
  CreateToRepositoryType,
  UpdateToRepositoryType,
} from "./schema/SchemaProduto.js";

export class Repository {
  async Create(data: CreateToRepositoryType) {
    return await Prisma.produto.create({
      data: data,
    });
  }
  async Update(data: UpdateToRepositoryType, id: number) {
    return await Prisma.produto.update({
      where: {
        id: Number(id),
      },
      data: data,
    });
  }
  async Delete(id: number) {
    return await Prisma.produto.delete({
      where: {
        id: Number(id),
      },
    });
  }
  async FindAll() {
    return await Prisma.produto.findMany();
  }

  async FindAllByEstoque(estoqueId: number) {
    return await Prisma.produto.findMany({
      where: {
        estoqueId: estoqueId,
      },
    });
  }
  async FindById(id: number) {
    return await Prisma.produto.findUnique({
      where: {
        id: Number(id),
      },
    });
  }
  async FindFornecedor(cnpj: string, contato: string) {
    return await Prisma.fornecedor.findFirst({
      where: {
        OR: [{ CNPJ: cnpj }, { contato: contato }],
      },
    });
  }
  async FindFornecedorById(id: number) {
    return await Prisma.fornecedor.findUnique({
      where: {
        id: Number(id),
      },
    });
  }
  async FindByData(nome: string, categoria: string) {
    return await Prisma.produto.findFirst({
      where: {
        OR: [{ nome: nome }, { categoria: categoria }],
      },
    });
  }
}
