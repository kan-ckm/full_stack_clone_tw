import {
    Injectable,
    type OnModuleDestroy,
    type OnModuleInit
} from '@nestjs/common'

import { PrismaClient } from '../../../prisma/generated/client'

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    // khi app chạy prisma sẽ connect vào database
 public async onModuleInit() {
     await this.$connect()
 }
 // khi app tắt prisma sẽ ngắt connect vào database
 public async onModuleDestroy() {
     await this.$disconnect()
 }
}
