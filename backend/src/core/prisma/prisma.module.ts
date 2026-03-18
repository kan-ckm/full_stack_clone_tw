import { Global, Module } from '@nestjs/common'

import { PrismaController } from './prisma.controller'
import { PrismaService } from './prisma.service'

@Global()
@Module({
    providers: [PrismaService],
    exports:[PrismaService]
})
export class PrismaModule {}
