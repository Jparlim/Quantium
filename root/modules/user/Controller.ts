import { FastifyReply, FastifyRequest } from "fastify";
import { ServicesAcount } from "./Services.js";
import { UpdateAcount } from "./schema/SchemaAcount.js";
import { ServicesEstoque } from "../estoque/Services.js";
import { VerifyTokenBody } from "./schema/SchemaAcount.js";
import { accessCookie, refreshCookie } from "../../infra/http/cookieOptions.js";
import { AppError } from "../../infra/error/AppError.js";

export const User_Controller = {
  async CreateUser(request: FastifyRequest, reply: FastifyReply) {
    const { token } = VerifyTokenBody.parse(request.body);
    const cookie = request.cookies.tokenVerify as string;

    if (!cookie) throw new AppError(401, "token não encontrado!");

    const decode = request.server.jwt.verify(cookie) as {
      id: number;
    };

    const id = await ServicesAcount.CreateAcount(decode, token);

    const estoqueId = await ServicesEstoque.CreateServices(id);

    const tokenJwt = request.server.jwt.sign(
      { IDcompany: id, role: "user", estoqueId: estoqueId.id },
      { expiresIn: "7d" },
    );

    const refreshTokenJwt = request.server.jwt.sign(
      { IDcompany: id, role: "user", estoqueId: estoqueId.id },
      { expiresIn: "30min" },
    );

    return reply
      .setCookie("token", tokenJwt, accessCookie)
      .setCookie("refreshToken", refreshTokenJwt, refreshCookie)
      .clearCookie("tokenVerify", { path: "/" })
      .send({ success: true, token: tokenJwt, refreshToken: refreshTokenJwt });
  },

  async UpdateUser(request: FastifyRequest, reply: FastifyReply) {
    const data = UpdateAcount.parse(request.body);
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesAcount.UpdateAcount(id, data);
  },

  async DeleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesAcount.DeleteAcount(id);
  },

  async FindAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesAcount.FindAllAcount();
  },

  async FindByIdUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    return await ServicesAcount.FindByIdAcount(id);
  },
};
