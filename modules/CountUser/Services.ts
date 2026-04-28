import { CreateAcount, CreateAcountPendingType, CreateAcountType, UpdateAcountType } from "./schema/SchemaAcount.js";
import { RepositoryCount } from "./Repository.js";
import { prisma } from "../../src/Prisma_Client/index.js";
import crypto from "crypto"
import bcrypt from "bcrypt"
import { FastifyInstance } from "fastify";

const repository = new RepositoryCount()

export const ServicesAcount = {
    async CreateAcountPending(data: CreateAcountPendingType, token: FastifyInstance) {
        const verify = await prisma.company.findFirst({
            where: {
                or: [
                    {nomeEmpresa: data.nome},
                    {CNPJ: data.CNPJ},
                    {numero: data.numero}
                ]
            }
        })

        if(verify) {
            throw new Error("Empresa já cadastrada!");
        }

        const tokenSend = crypto.randomInt(100000, 1000000).toString();
        const hashSenha = await bcrypt.hash(data.senha, 10);

        const newData = { ...data, senha: hashSenha, token: tokenSend };

        const IdPending = await repository.createPending(newData);
        
        const tokenJWT = token.jwt.sign
        (
            {
                id: IdPending.id,
                token: tokenSend,
            },
            {
                expiresIn: "5m"
            }
        )

        console.log(tokenSend);

        return tokenJWT;
    },

    async CreateAcount(data: CreateAcountType) {
        return repository.create(data);
    },

    async UpdateAcount(id: number, data: UpdateAcountType) {
        return repository.update(id, data);
    },

    async DeleteAcount(id: number) {
        return repository.delete(id);
    },

    async FindAllAcount() {
        return repository.findAll();
    },

    async FindByIdAcount(id: number) {
        return repository.findById(id);
    }
}