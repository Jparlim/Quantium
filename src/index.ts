import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors"
import { whatsapp } from "./Whatsapp";
import { ChosenClient } from "./PromptIA/ConfigIA";
import { CriaConta } from "./Create_and_Login/createConta";
import { Login } from "./Create_and_Login/loginConta";
import jwt from "@fastify/jwt";
import { Token } from "./Create_and_Login/token";
import { DeleteVisits } from "./Visits/deletVisits";
import cron from "node-cron"
import { DelPending } from "./Prisma_Client/del_pending_users";
import { GetVisits } from "./Visits/getVisits";
import { CreateVisits } from "./Visits/createVisits";
import { Visits_Client_id } from "./Visits/visits_client_id";
import cookie from "@fastify/cookie"
import { UpdateConfigIA } from "./PromptIA/IA/update";


const App = fastify({logger:true});
App.register(import("@fastify/formbody"))
App.register(cors, { origin: "http://localhost:5173", credentials: true })

App.register(jwt, {
  secret: process.env.JWT_SECRET as string
})

App.register(jwt, {
  secret: process.env.JWT_REFRESH_SECRET as string,
  namespace: "refresh"
})

App.register(cookie, {
  secret: process.env.COOKIE_SECRET as string
})

App.post("/refresh", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { refreshToken } = request.cookies as { refreshToken: string };

    if (!refreshToken) {
      return reply.status(401).send({ message: "Refresh token não enviado" });
    }

    const decoded = App.jwt.verify(refreshToken) as { IDcompany: number };

    const newAccessToken = App.jwt.sign(
      { IDcompany: decoded.IDcompany },
      { expiresIn: "15m" }
    )

    return reply.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: '/',
        maxAge: 60 * 15
      }).send({ success: true })

  } catch(error) {
    return reply.status(401).send({ message: "refresh token inválido!" })
  }
});


App.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  }
)

// preciso colocar este preHandler em endpoints importantes, como login, cadastro, criar produto, salvar dados, listar empresa por exemplo.

// App.get('/whatsapp', {preHandler: [App.authenticate]}, whatsapp)



App.post('/whatsapp', whatsapp)

App.post('/config', ChosenClient)

App.put('/config/update', UpdateConfigIA)

// login and create count

App.post('/create', (request:FastifyRequest, reply: FastifyReply) => CriaConta(request, reply, App))

App.post('/login', (request:FastifyRequest, reply: FastifyReply) => Login(request, reply, App))

App.post('/create/verify-token', (request: FastifyRequest, reply: FastifyReply) => Token(request, reply, App))

// visits

App.delete(`/visits/delete/:id`, DeleteVisits)

App.get(`/visits/get/:date`, GetVisits)

App.get("/visits/get_client_id", Visits_Client_id)

App.post(`/visits/create`, CreateVisits)

// clients

// App.post(`/client/create`, )

// ===================================================================================

cron.schedule("*/15 * * * *", () => DelPending())

const port = Number(process.env.PORT) || 3000;

App.listen({ port, host: "0.0.0.0" })
  .then(() => {
    console.log(`🚀 Server rodando na porta ${port}`);
  })
  .catch((err) => {
    App.log.error(err);
    process.exit(1);
  });