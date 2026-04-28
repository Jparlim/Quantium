import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServicesAcount } from "./Services.js";
import { CreateAcount, UpdateAcount, CreateAcountPending } from "./schema/SchemaAcount.js";

export class Controller {
    async CreateCountPending(request: FastifyRequest, reply: FastifyReply, App: FastifyInstance) {
        const data = CreateAcountPending.parse(request.body);

        const token = await ServicesAcount.CreateAcountPending(data, App);

        return reply.status(200).setCookie("tokenVerify", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax",
            path: '/',
            maxAge: 60 * 5
        }).send({ success: true });
    }

    async CreateCount(request: FastifyRequest, reply: FastifyReply) {
        const data = CreateAcount.parse(request.body);

        return ServicesAcount.CreateAcount(data);
    }

    async UpdateCount(request: FastifyRequest, reply: FastifyReply) {
        const data = UpdateAcount.parse(request.body);
        const { id } = request.params as { id: number };

        return ServicesAcount.UpdateAcount(id, data);
    }

    async DeleteCount(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: number };

        return ServicesAcount.DeleteAcount(id);
    }

    async FindAllCount(request: FastifyRequest, reply: FastifyReply) {
        return ServicesAcount.FindAllAcount();
    }

    async FindByIdCount(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: number };

        return ServicesAcount.FindByIdAcount(id);
    }
}