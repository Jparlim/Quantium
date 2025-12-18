import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors"
import { whatsapp } from "./services/Whatsapp";
import { ChosenClient } from "./services/chosenclient";
import { CriaConta } from "./loginANDcreate/createConta";
import {prisma} from "./Prisma_Client";
import { Login } from "./loginANDcreate/loginConta";
import jwt from "@fastify/jwt";
import { Token } from "./loginANDcreate/token";

import cron from "node-cron"
import { DelPending } from "./Prisma_Client/del_pending_users";

const App = fastify({logger:true});
App.register(import("@fastify/formbody"))
App.register(cors, { origin: "*"})

App.register(jwt, {
  secret: "LoboPidao"
})

App.post('/whatsapp', whatsapp)

App.post('/chosen', ChosenClient)

App.post('/create', ( request, reply ) => CriaConta(App, request, reply))

App.post('/login', (request, reply) => Login(App, request, reply))

App.post('/create/token', Token)

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