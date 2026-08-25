import "dotenv/config";
import fastify from "fastify";
import formbody from "@fastify/formbody";
import { Route } from "./routes/routes.js";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { ErrorHandle } from "../error/errorHandle.js";

const App = fastify({ logger: true });

App.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(",") ?? true,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});
App.register(formbody);
App.register(cookie, {
  secret: process.env.COOKIE_SECRET as string,
});
App.register(jwt, {
  secret: process.env.JWT_SECRET as string,
});
App.register(jwt, {
  secret: process.env.JWT_REFRESH_SECRET as string,
  namespace: "refresh",
});
ErrorHandle(App);

App.register(Route);

const start = async () => {
  try {
    await App.listen({ port: 8888, host: "0.0.0.0" });
    console.log(
      `Back-end:  ${process.env.SERVER_ORIGIN?.split(",")}
      Front-end: ${process.env.CORS_ORIGIN?.split(",")}`,
    );
  } catch (error) {
    App.log.error(error);
    process.exit(1);
  }
};

start();
