import { FastifyReply, FastifyRequest } from "fastify";
import { SchemaCreateVisits } from "./schema/SchemaVisits.js";
import { ServicesVisits } from "./Services.js";

export const Controller = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const data = SchemaCreateVisits.parse(request.body);
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    // tanto adm quanto user podem criar visitas

    return await ServicesVisits.CreateServices(data, decode.IDcompany);
  },

  async DeleteController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!id) return reply.status(401).send({ message: "id não fornecido!" });

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    // tanto adm quanto user podem criar visitas

    return ServicesVisits.DeleteServices(id, decode.IDcompany);
  },

  async FindAllController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    const { year, month } = request.query as {
      year?: string;
      month?: string;
    };

    return await ServicesVisits.FindAllServices(
      decode.IDcompany,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
    );
  },

  async UpdateController() {},

  async FindByIdController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    if (!id) return reply.status(401).send("id não encontrado.");

    return await ServicesVisits.FindByIdServices(id);
  },
};
