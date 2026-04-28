import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

// tạo một redis client dùng trong toàn app nestjs
@Injectable()
export class RedisService extends Redis {
    constructor(private readonly configService: ConfigService) {
        super(configService.getOrThrow<string>('REDIS_URL'))
    }
}
