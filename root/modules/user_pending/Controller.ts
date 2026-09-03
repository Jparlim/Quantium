import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServicesAcount } from "./Services.js";
import { CreateAcountWithDataOnBody } from "./schema/SchemaAcount.js";
import { verifyCookie } from "../../infra/http/cookieOptions.js";
import { AppError } from "../../infra/error/AppError.js";

export const User_Pending_Controller = {
  async CreateUserPending(request: FastifyRequest, reply: FastifyReply) {
    const data = CreateAcountWithDataOnBody.parse(request.body);

    const result = await ServicesAcount.CreateAcountPending(data);

    await ServicesAcount.CreateAcountPending(data);

    request.log.info({ codigo: result.codigo }, "código de verificação gerado");

    const tokenJWT = request.server.jwt.sign(
      {
        id: result.user.id,
      },
      {
        expiresIn: "15m",
      },
    );

    return reply
      .status(200)
      .setCookie("tokenVerify", tokenJWT, verifyCookie)
      .send({
        success: true,
        email: result.user.email,
        expiresIn: 60 * 15,
        ...(process.env.NODE_ENV !== "production"
          ? { devToken: result.codigo }
          : {}),
      });
  },

  async ResendUserPending(request: FastifyRequest, reply: FastifyReply) {
    const cookie = request.cookies.tokenVerify as string;

    if (!cookie)
      throw new AppError(401, "sessão de cadastro expirou, refaça o cadastro");

    const decode = request.server.jwt.verify(cookie) as { id: number };

    const result = await ServicesAcount.ResendToken(decode.id, request.server);

    request.log.info(
      { codigo: result.codigo },
      "código de verificação reenviado",
    );

    return reply
      .status(200)
      .setCookie("tokenVerify", result.token, verifyCookie)
      .send({
        success: true,
        email: result.user.email,
        expiresIn: 60 * 15,
        ...(process.env.NODE_ENV !== "production"
          ? { devToken: result.codigo }
          : {}),
      });
  },

  async DeleteUserPending(request: FastifyRequest, reply: FastifyReply) {
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

  async FindAllUserPending(request: FastifyRequest, reply: FastifyReply) {
    const token = request.cookies.refreshToken as string;

    if (!token)
      return reply.status(401).send({ message: "token não encontrado! " });

    const decode = request.server.jwt.verify(token) as {
      IDcompany: number;
      role: string;
    };

    if (decode.role !== "admin")
      return reply.status(403).send({ message: "Acesso negado!" });

    const data = await ServicesAcount.FindAllAcount();
    return data;
  },

  async FindByIdUserPending(request: FastifyRequest, reply: FastifyReply) {
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

    return ServicesAcount.FindByIdAcount(id);
  },
};
