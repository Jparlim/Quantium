import z from "zod"

export const CreateAcount = z.object({
    "nomeEmpresa": z.string().nonempty({message: "O nome da empresa é obrigatório!"}),
    "email": z.string().nonempty({message: "Email inválido!"}),
    "senha": z.string().nonempty({message: "A senha é obrigatória!"}),
    "CNPJ": z.string().nonempty({message: "O CNPJ é obrigatório!"}),
    "numero": z.string().nonempty({message: "O número de telefone é obrigatório!"}),
    "status": z.boolean().default(true),
})

export const CreateAcountPending = z.object({
    "nome": z.string().nonempty({message: "O nome da empresa é obrigatório!"}),
    "email": z.string().nonempty({message: "Email inválido!"}),
    "senha": z.string().nonempty({message: "A senha é obrigatória!"}),
    "CNPJ": z.string().nonempty({message: "O CNPJ é obrigatório!"}),
    "numero": z.string().nonempty({message: "O número de telefone é obrigatório!"}),
    "token": z.string().nonempty({message: "O token é obrigatório!"}),
})

export const UpdateAcount = z.object({
    "nomeEmpresa": z.string().optional(),
    "email": z.string().optional(),
    "senha": z.string().optional(),
    "CNPJ": z.string().optional(),
    "numero": z.string().optional(),
    "status": z.boolean().optional(),
})

export type CreateAcountPendingType = z.infer<typeof CreateAcountPending>
export type CreateAcountType = z.infer<typeof CreateAcount>
export type UpdateAcountType = z.infer<typeof UpdateAcount>