import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'

import { PrismaService } from '@/src/core/prisma/prisma.service'

import type { CreateUserInput } from '../inputs/create-user.input'

@Injectable()
export class AccountService {
    // khai báo tự tạo PrismaService ko cần tạo thủ công
    public constructor(private readonly prismaService: PrismaService) {}

    // query lấy tất cả người dùng
    public async findAll() {
        const users = await this.prismaService.user.findMany()

        return users
    }
    // query tạo người dùng
    public async create(input: CreateUserInput) {
        const { username, email, password } = input
        const isEmailExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })
        if (isEmailExists) {
            throw new ConflictException('Email đã tồn tại')
        }
        await this.prismaService.user.create({
            data: {
                username,
                email,
                password: await hash(password),
                displayName: username
            }
        })
        return true
    }
}
