import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { getGraphQLConfig } from './core/config/graphql.config'
import { PrismaModule } from './core/prisma/prisma.module'
import { RedisModule } from './core/redis/redis.module'
import { AccountModule } from './modules/auth/account/account.module'

//module trung tâm dùng để tập hợp và cấu hình các thành phần cốt lõi của ứng dụng.
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        // dùng để tạo graphsql nhưng config linh động hơn và giúp graphql chắc chắn đọc được file env
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports: [ConfigModule],
            useFactory: getGraphQLConfig, // giúp bật giao diện quản lý truy vấn web của graphql
            inject: [ConfigService]
        }),
        PrismaModule,
        RedisModule,
        AccountModule
    ]
})
export class CoreModule {}
