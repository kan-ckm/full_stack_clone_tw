import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { Request } from 'express'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.util'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
    // khai báo luôn prisma đỡ phải config thủ công
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService
    ) {}
    // phương pháp 1 tìm kiếm tất cả session của user hiện tại, nó không hiệu quả vì phải duyệt tất cả session trong redis, nhưng nó đảm bảo chính xác
    public async findByUser(req: Request) {
        try {
            const userId = req.session.userId
            if (!userId) {
                throw new NotFoundException('Không tìm thấy')
            }
            const keys = await this.redisService.get('*')
            const userSessions: any[] = []

            for (const key of keys || []) {
                const sessionData = await this.redisService.get(key)

                if (sessionData) {
                    const session = JSON.parse(sessionData)
                    // Kiểm tra nếu session thuộc về user hiện tại không
                    if (session.userId === userId) {
                        userSessions.push({
                            ...session,
                            id: key.split(':')[1]
                        })
                    }
                }
            }
            userSessions.sort((a, b) => b.createdAt - a.createdAt)
            return userSessions.filter(session => session.id === req.session.id)
        } catch (error) {
            console.error('Lỗi khi tìm kiếm session:', error)
            throw new InternalServerErrorException('Không thể tìm kiếm session')
        }
    }
    // phương pháp 2 tìm kiếm session hiện tại, nó nhanh hơn vì chỉ truy cập một key duy nhất trong redis, nhưng nó có thể không chính xác nếu user đăng nhập từ nhiều thiết bị khác nhau
    public async findCurrent(req: Request) {
        try {
            const sessionId = req.session.id
            const sessionData = await this.redisService.get(
                `${this.configService.getOrThrow<string>('SESSION_FOLDER')}:${sessionId}`
            )
            if (!sessionData) {
                throw new NotFoundException('Session không tồn tại')
            }
            const session = JSON.parse(sessionData)

            return {
                ...session,
                id: sessionId
            }
        } catch (error) {
            console.error('Lỗi khi tìm kiếm session:', error)
        }
    }
    //service đăng nhập
    public async login(req: Request, input: LoginInput, usetAgent: string) {
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

        const metadata = getSessionMetadata(req, usetAgent)

        // Promise lưu session thông tin người dùng vào redis
        return new Promise((resolve, reject) => {
            req.session.createdAt = new Date()
            req.session.userId = user.id
            req.session.metadata = metadata

            req.session.save(err => {
                if (err) {
                    console.log(err)
                    return reject(
                        new InternalServerErrorException(
                            'Không lưu được session'
                        )
                    )
                }
                resolve(user)
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
                req.res?.clearCookie(
                    this.configService.getOrThrow<string>('SESSION_NAME')
                )
                resolve(true)
            })
        })
    }

    // xóa session trên browser
    public async clearSession(req: Request) {
        req.res?.clearCookie(
            this.configService.getOrThrow<string>('SESSION_NAME')
        )
        return true
    }
    // xóa session trên redis

    public async remove(req: Request, id: string) {
        if (req.session.id === id) {
            throw new ConflictException('Không thể xóa session hiện tại')
        }

        await this.redisService.del(
            `${this.configService.getOrThrow<string>('SESSION_FOLDER')}:${id}`
        )
        return true
    }
}
