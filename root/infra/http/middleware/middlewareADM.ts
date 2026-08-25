import { FastifyRequest, FastifyReply } from "fastify";

export function middlewareValidatorAdm(req: FastifyRequest, rep: FastifyReply) {
  const token = req.cookies.refreshToken as string;

  if (!token)
    return rep.status(401).send({ message: "token não encontrado! " });

  const decode = req.server.jwt.verify(token) as {
    IDcompany: number;
    role: string;
  };

  if (decode.role !== "admin")
    return rep.status(403).send({ message: "Acesso negado!" });
}

