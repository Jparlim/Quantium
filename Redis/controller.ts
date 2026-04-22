import { createClient } from 'redis';

export const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

// redis-cli -u redis://default:cuv65HQAq7NHAz5ZHAIvd8iBO06y6hrv@redis-19139.crce278.sa-east-1-2.ec2.cloud.redislabs.com:19139