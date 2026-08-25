import { FastifyReply, FastifyRequest } from "fastify";
import { SchemaCreateIA, SchemaUpdateIA } from "./schema/schemaIA.js";
import { ServicesIA } from "./Services.js";

export const ControllerIA = {
  async CreateController(request: FastifyRequest, reply: FastifyReply) {
    const data = SchemaCreateIA.parse(request.body);
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    return await ServicesIA.CreateServices(data, decode.IDcompany);
  },

  async DeleteController(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    return await ServicesIA.DeleteServices(id);
  },

  async FindAllController(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesIA.FindByCompanyServices(decode.IDcompany);
  },

  async UpdateController(request: FastifyRequest, reply: FastifyReply) {
    const data = SchemaUpdateIA.parse(request.body);
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado!" });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    return await ServicesIA.UpdateServices(decode.IDcompany, data);
  },
};
