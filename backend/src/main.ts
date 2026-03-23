import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as cookieParser from 'cookie-parser'

// cách ghi * as cookieParser có nghĩa là import tất cả thư viện đó dưới tên biến là cookieParser

import { CoreModule } from './core.module'

// các ghi * as cookieParser có nghĩa là import tất cả thư viện đó dưới tên biến là cookieParser
async function bootstrap() {
    const app = await NestFactory.create(CoreModule)

    const config = app.get(ConfigService)
    app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')))
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
        })
    )

    app.enableCors({
        origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
        credentials: true,
        exposeHeaders: ['set-cookie']
    })

    await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap()
