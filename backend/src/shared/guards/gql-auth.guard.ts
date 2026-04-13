import {
    type CanActivate,
    type ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import type { PrismaService } from '@/src/core/prisma/prisma.service'

@Injectable()
/*
GqlAuthGuard là một lớp bảo vệ route (API).
Kiểm tra session có userId không
Nếu không có → chặn request (Unauthorized)
Nếu có → lấy user từ database và gắn vào request
*/
export class GqlAuthGuard implements CanActivate {
    public constructor(private readonly prismaService: PrismaService) {}
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context)
        const request = ctx.getContext().req
        if (typeof request.session?.userId === 'undefined') {
            throw new UnauthorizedException(
                'Bạn cần đăng nhập để truy cập tài nguyên này'
            )
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                id: request.session.userId
            }
        })
        request.user = user
        return true
    }
}
