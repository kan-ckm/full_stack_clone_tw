import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { User } from '@/prisma/generated'

/* biến ctx viết tắt của context, nó đại diện cho ngữ cảnh hiện tại của request.
Authorized là một decorator tùy chỉnh để lấy thông tin người dùng đã được xác thực từ request.
Khi sử dụng @Authorized() trong một resolver hoặc controller, nó sẽ trích xuất thông tin người dùng từ request và cung cấp nó dưới dạng tham số cho resolver hoặc controller đó.
Nếu truyền vào một khóa cụ thể của User (ví dụ: @Authorized('id')), nó sẽ trả về giá trị tương ứng của khóa đó từ đối tượng người dùng.
*/
export const Authorized = createParamDecorator(
    (data: keyof User, ctx: ExecutionContext) => {
        let user: User
        if (ctx.getType() === 'http') {
            user = ctx.switchToHttp().getRequest().user
        } else {
            const context = GqlExecutionContext.create(ctx)
            user = context.getContext().req.user
        }
        return data ? user[data] : user
    }
)
