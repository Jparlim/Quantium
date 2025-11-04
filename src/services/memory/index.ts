import Redis from "ioredis"
import "dotenv/config"

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
})

// salvar a mensagem do cliente
// mandar o histórico
// salvar resposta IA de acordo com o historico
export async function Memory(numberClient:string ,messageClient:string) {
    await redis.set(numberClient, JSON.stringify(messageClient))
}


// Memory("984623351", teste)
// await redis.del("984623351")
// console.log(await redis.get("984623351"))
