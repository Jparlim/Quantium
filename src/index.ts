import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors"
import { whatsapp } from "./services/Whatsapp";
import { ChosenClient } from "./services/chosenclient";
import { CriaConta } from "./loginANDcreate/createConta";
import prisma from "./db";
import { Login } from "./loginANDcreate/loginConta";
import jwt from "@fastify/jwt";

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

// ===================================================================================

App.get('/companys/data', async (request, response) => {
  const { id } = request.params as { id:number }

  if(id) {
    const data = await prisma.company.findUnique({
      where: {
        id: id
      }
    })
    return response.send(data)
  }

  const data = await prisma.company.findMany()
  return response.send(data)
})

App.get('/chosens/data', async (request, response) => {
  const { id } = request.params as { id:number }

  if(id) {
    const data = await prisma.iA.findUnique({
      where: {
        id: id
      }
    })
    return response.send(data)
  }

  const data = await prisma.iA.findMany()
  return response.send(data)
})

App.get("/clients", async (request, response) => {
 const { id } = request.params as { id:number }

  if(id) {
    const data = await prisma.cliente.findUnique({
      where: {
        id: id
      }
    })
    return response.send(data)
  }

  const data = await prisma.cliente.findMany()
  return response.send(data)
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