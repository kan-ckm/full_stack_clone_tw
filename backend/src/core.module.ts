import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { PrismaModule } from './core/prisma/prisma.module'
import { getGraphQLConfig } from './core/config/graphql.config'
//module trung tâm dùng để tập hợp và cấu hình các thành phần cốt lõi của ứng dụng.
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        GraphQLModule.forRootAsync({
            driver: ApolloDriver,
            imports:[ConfigModule],
            useFactory:getGraphQLConfig,
            inject:[ConfigService]
        }),
        PrismaModule
    ]
})
export class CoreModule {}
