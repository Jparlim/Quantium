import { FastifyInstance } from "fastify";
import { ControllerLogin } from "./Controller.js";

export async function Login_Route(app: FastifyInstance) {
  app.post("/login", ControllerLogin.validateUser);

  app.post("/login/adm", ControllerLogin.validateAdmin);
}
