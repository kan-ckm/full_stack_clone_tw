import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisStore } from 'connect-redis'
// cách ghi * as cookieParser có nghĩa là import tất cả thư viện đó dưới tên biến là cookieParser
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'

import { CoreModule } from './core.module'
import { RedisService } from './core/redis/redis.service'
import { ms, type StringValue } from './shared/utils/ms.util'
import { parseBoolean } from './shared/utils/parse-boolean..util'

async function bootstrap() {
    const app = await NestFactory.create(CoreModule)

    const config = app.get(ConfigService)
    const redis = app.get(RedisService)

    //  đọc cookie từ req
    app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))

    // validation toàn cục kiểm tra dữ liệu đầu vào
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
        })
    )

    // auth session lưu vào redis
    app.use(
        session({
            secret: config.getOrThrow<string>('SESSION_SECRET'),
            name: config.getOrThrow<string>('SESSION_NAME'),
            resave: false,
            saveUninitialized: false,
            cookie: {
                // domain áp dụng cookie "nói chung thì dùng để set xem đang ở môi trường nào để chỉnh thêm" chi tiết ở https://docs.nestjs.com/techniques/session
                domain: config.getOrThrow<string>('SESSION_DOMAIN'),
                maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
                httpOnly: parseBoolean(
                    config.getOrThrow<string>('SESSION_HTTP_ONLY')
                ), // chỉ gửi cookie thông qua https có thể tắt hoặc bật
                secure: parseBoolean(
                    config.getOrThrow<string>('SESSION_SECURE')
                ),
                // lax là kiểu an toàn chống CSRF
                sameSite: 'lax'
            }, // nơi lưu vào redis hay vì RAM
            store: new RedisStore({
                client: redis,
                prefix: config.getOrThrow<string>('SESSION_FOLDER')
            })
        })
    )

    // cho phép frontend gọi API
    app.enableCors({
        origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
        credentials: true,
        exposeHeaders: ['set-cookie']
    })

    await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap()
