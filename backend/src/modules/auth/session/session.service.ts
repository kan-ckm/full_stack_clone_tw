import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { verify } from 'argon2'
import { rejects } from 'assert'
import type { Request } from 'express'

import  { PrismaService } from '@/src/core/prisma/prisma.service'

import { LoginInput } from './inputs/login.input'
import  { ConfigService } from '@nestjs/config'

@Injectable()
export class SessionService {
    // khai báo luôn prisma đỡ phải config thủ công
    public constructor(private readonly prismaService: PrismaService , private readonly configService:ConfigService) {}

    //service đăng nhập
    public async login(req: Request, input: LoginInput) {
        const { login, password } = input

        const user = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    { username: { equals: login } },
                    { email: { equals: login } }
                ]
            }
        })
        if (!user) {
            throw new NotFoundException('Tài khoản không tồn tại')
        }
        const isValidPassword = await verify(user.password, password)
        if (!isValidPassword) {
            throw new UnauthorizedException('Sai mật khẩu')
        }
        // Promise lưu session thông tin người dùng vào redis
        return new Promise((resolve, reject) => {
            req.session.createdAt = new Date()
            req.session.userId = user.id

            req.session.save(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Không lưu được session'
                        )
                    )
                }
                resolve({
                    user
                })
            })
        })
    }
    public async logout(req: Request) {
        return new Promise((resolve, reject) => {
            //destroy là method xóa session
            req.session.destroy(err => {
                if (err) {
                    return reject(
                        new InternalServerErrorException(
                            'Không xóa được session'
                        )
                    )
                }
                req.res?.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'))
                resolve(true)
            })
        })
    }
}
