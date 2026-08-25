import {
  CreateToServicesType,
  UpdateToControllerType,
  UpdateToRepositoryType,
} from "./schema/SchemaProduto.js";
import { Repository } from "./Repository.js";

const repository = new Repository();

export const ServicesProduto = {
  async CreateServices(data: CreateToServicesType) {
    const idFornecedor = await repository.FindFornecedor(
      data.CNPJFornecedor,
      data.contatoFornecedor,
    );

    if (!idFornecedor)
      throw new Error("fornecedor não encontrado no banco de dados!");

    const verify = await repository.FindByData(data.nome, data.categoria);

    if (verify) throw new Error("produto já cadastrado no banco de dados!");

    const newDAta = {
      nome: data.nome,
      categoria: data.categoria,
      quantidade: data.quantidade,
      valor_unitario: data.valor_unitario,
      fornecedorId: idFornecedor?.id!,
      estoqueId: data.estoqueId,
    };

    return await repository.Create(newDAta);
  },

  async UpdateServices(id: number, data: UpdateToRepositoryType) {
    const verify = await repository.FindById(id);
    const idFornecedor = await repository.FindFornecedorById(
      data.fornecedorId!,
    );

    if (!idFornecedor)
      throw new Error("fornecedor não encontrado no banco de dados!");

    if (!verify) throw new Error("produto não encontrado no banco de dados!");

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== "" && value !== undefined,
      ),
    );

    return await repository.Update(filteredData, id);
  },

  async DeleteServices(id: number) {
    const verify = await repository.FindById(id);

    if (!verify) throw new Error("produto não encontrado no banco de dados!");

    return await repository.Delete(id);
  },

  async FindAllServices(estoqueId: number) {
    return await repository.FindAllByEstoque(estoqueId);
  },

  async FindByIdServices(id: number) {
    const verify = await repository.FindById(id);

    if (!verify) throw new Error("produto não encontrado no banco de dados!");

    return await repository.FindById(id);
  },
};
