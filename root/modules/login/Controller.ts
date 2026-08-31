import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceLogin } from "./Service.js";
import { ServicesEstoque } from "../estoque/Services.js";
import { accessCookie, refreshCookie } from "../../infra/http/cookieOptions.js";
import { AppError } from "../../infra/error/AppError.js";

export const ControllerLogin = {
  async validateUser(request: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = request.body as { email: string; senha: string };

    const data = await ServiceLogin.validateUser(email, senha);

    const estoque = await ServicesEstoque.FindByCompanyIdServices(data);

    if (!estoque)
      throw new AppError(500, "estoque não encontrado para a empresa!");

    const token = request.server.jwt.sign(
      {
        IDcompany: data,
        role: "user",
        estoqueId: estoque.id,
      },
      { expiresIn: "30m" },
    );

    const refreshToken = request.server.jwt.sign(
      {
        IDcompany: data,
        role: "user",
        estoqueId: estoque.id,
      },
      { expiresIn: "7d" },
    );

    return reply
      .setCookie("token", token, accessCookie)
      .setCookie("refreshToken", refreshToken, refreshCookie)
      .send({ success: true, token, refreshToken });
  },

  async validateAdmin(request: FastifyRequest, reply: FastifyReply) {
    const { email, senha } = request.body as { email: string; senha: string };

    const userId = await ServiceLogin.validateAdmin(email, senha);

    const token = request.server.jwt.sign(
      {
        IDcompany: userId,
        role: "admin",
      },
      { expiresIn: "30m" },
    );

    const refreshToken = request.server.jwt.sign(
      {
        IDcompany: userId,
        role: "admin",
      },
      { expiresIn: "7d" },
    );

    return reply
      .setCookie("token", token, accessCookie)
      .setCookie("refreshToken", refreshToken, refreshCookie)
      .send({ success: true, token, refreshToken });
  },
};
