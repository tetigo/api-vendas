import Redis, { Redis as RedisClient } from "ioredis"
import cacheConfig from '@config/cache'

//server do redis
//docker run --name redis -p 6379:6379 -d -t redis:alpine

//client que consegue ver o que foi salvo no server: http://localhost:8001 (RedisInsight)
//docker run --name redis-client -v redisinsight:/db -p 8001:8001 -d -t redislabs/redisinsight:latest
//docker inspect nome_do_container_redis_server, daí pega o ipaddress pra conseguir conectar no browser 8001
//ipconfig no host tambem serve: pegar o ipv4: 192.168........


class RedisCache{
    private client: RedisClient

    constructor(){
        this.client = new Redis(cacheConfig.config.redis)
    }

    public async save(key: string, value: any): Promise<void>{
        await this.client.set(key, JSON.stringify(value))
        console.log(key,value)
    }

    public async recover<T>(key: string): Promise<T | null>{
        const data = await this.client.get(key)
        if(!data) return null
        return JSON.parse(data) as T
    }

    public async invalidate(key: string): Promise<void>{
        await this.client.del(key)
    }


}
export default RedisCache