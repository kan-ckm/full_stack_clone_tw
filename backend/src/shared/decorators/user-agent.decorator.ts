import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { Request } from 'express'

/*
Đây là một custom param decorator trong NestJS, dùng để tự động trích xuất User-Agent từ request header — thay vì phải lấy thủ công trong từng resolver/controller.
*/
export const UserAgent = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        if (ctx.getType() === 'http') {
            const request = ctx.switchToHttp().getRequest() as Request
            return request.headers['user-agent'] || 'unknown'
        } else {
            const context = GqlExecutionContext.create(ctx)
            return context.getContext().req.headers['user-agent'] || 'unknown'
        }
    }
)
