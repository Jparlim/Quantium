import fastify from "fastify";
import cors from "@fastify/cors"
import { IAconfig } from "./services/Whatsapp";
import { ChosenClient } from "./services/chosenclient";
import { CriaConta } from "./pages/createConta";

const App = fastify({logger:true});
App.register(import("@fastify/formbody"))
App.register(cors, { origin: "*"})


App.post('/whatsapp', IAconfig)

App.post('/chosen', ChosenClient)

App.post('/create', CriaConta)

// App.get('/chosen/data', )

// App.post('/chosen/change', )

// App.get("/", async (request, reply) => {
//     return { status: "servidor rodando!"}
// })


const port = Number(process.env.PORT) || 3000;

App.listen({ port, host: "0.0.0.0" })
  .then(() => {
    console.log(`🚀 Server rodando na porta ${port}`);
  })
  .catch((err) => {
    App.log.error(err);
    process.exit(1);
  });