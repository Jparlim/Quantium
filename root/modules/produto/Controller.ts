import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateToController,
  UpdateRepository,
} from "./schema/SchemaProduto.js";
import { ServicesProduto } from "./Services.js";

export const ControllerProduto = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateToController.parse(request.body);
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não enviado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
      estoqueId: number;
    };

    if (decode.role !== "admin")
      return reply.status(401).send({ message: "acesso negado!" });

    return await ServicesProduto.CreateServices({
      ...data,
      estoqueId: decode.estoqueId,
    });
  },

  async UpdateController(request: FastifyRequest, reply: FastifyReply) {
    const data = UpdateRepository.parse(request.body);
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não enviado!" });

    if (!id)
      return reply
        .status(400)
        .send({ message: "id do produto não informado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
      estoqueId: number;
    };

    if (decode.role !== "admin")
      return reply.status(401).send({ message: "acesso negado!" });

    return await ServicesProduto.UpdateServices(id, data);
  },

  async DeleteController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!id)
      return reply
        .status(400)
        .send({ message: "id do produto não informado!" });

    if (!token)
      return reply.status(401).send({ message: "token não enviado!" });

    return await ServicesProduto.DeleteServices(id);
  },

  async FindAllController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não enviado!" });

    const decode = request.server.jwt.decode(token) as {
      IDcompany: number;
      role: string;
      estoqueId: number;
    };

    return await ServicesProduto.FindAllServices(decode.estoqueId);
  },

  async FindByIdController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    // deixar esta função em observação, pois no futuro ou no momento podemos acrescentar um filtro para encontrar produto, e talvez usar esta função

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });
    if (!id)
      return reply
        .status(400)
        .send({ message: "id do produto não informado!" });

    return await ServicesProduto.FindByIdServices(id);
  },
};
