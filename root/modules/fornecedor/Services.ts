import { Repository } from "./Repository.js";
import {
  CreateControllerType,
  updateControllerType,
} from "./schema/SchemaProduto.js";

const repository = new Repository();

export const ServicesFornecedor = {
  async CreateServices(data: CreateControllerType) {
    const verify = await repository.FindByData(data);

    if (verify) throw new Error("fornecedor já cadastrado!");

    return await repository.Create(data);
  },

  async UpdateServices(data: updateControllerType, id: number) {
    const verify = repository.FindById(id);

    if (!verify) throw new Error("fornecedor não encontrado!");

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== "" && value !== undefined,
      ),
    );

    return await repository.Update(filteredData, id);
  },

  async DeleteServices(companyId: number, fornecedorId: number) {
    return await repository.Delete(companyId, fornecedorId);
  },

  async FindAllServices() {
    return await repository.FindAll();
  },

  async FindByIdServices(id: number) {
    return await repository.FindById(id);
  },
};
