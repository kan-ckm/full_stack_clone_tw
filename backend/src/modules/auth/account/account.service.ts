import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
export class AccountService {
    // khai báo tự tạo PrismaService ko cần tạo thủ công
    public constructor(private readonly prismaService: PrismaService) {}

    // query lấy tất cả người dùng
    public async findAll() {
        const users = await this.prismaService.user.findMany()

        return users
    }
}
