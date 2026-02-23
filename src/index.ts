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


const App = fastify({logger:true});
App.register(import("@fastify/formbody"))
App.register(cors, { origin: "*"})

App.register(jwt, {
  secret: process.env.JWT_SECRET as string
})

App.register(cookie, {
  secret: process.env.COOKIE_SECRET as string
})

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

App.post('/chosen', ChosenClient)

// login and create count

App.post('/create', CriaConta)

App.post('/login', (request:FastifyRequest, reply: FastifyReply) => Login(request, reply, App))

App.post('/create/token', (request: FastifyRequest, reply: FastifyReply) => Token(request, reply, App))

// visits

App.delete(`/visits/delete/:id`, DeleteVisits)

App.get(`/visits/get/:date`, GetVisits)

App.get("/visits/get_client_id", Visits_Client_id)

App.post(`/visits/create`, CreateVisits)

// clients

// App.post(`/client/create`, )

// ===================================================================================

cron.schedule("*/15 * * * *", async () => {
  await DelPending()
})

const port = Number(process.env.PORT) || 3000;

App.listen({ port, host: "0.0.0.0" })
  .then(() => {
    console.log(`🚀 Server rodando na porta ${port}`);
  })
  .catch((err) => {
    App.log.error(err);
    process.exit(1);
  });