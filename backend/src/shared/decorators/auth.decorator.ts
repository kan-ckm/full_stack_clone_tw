import { applyDecorators, UseGuards } from '@nestjs/common'

import { GqlAuthGuard } from '../guards/gql-auth.guard'

/*
Authorization là một decorator tùy chỉnh để áp dụng GqlAuthGuard cho các resolver hoặc controller.
Khi sử dụng @Authorization() trên một resolver hoặc controller, nó sẽ tự động áp dụng GqlAuthGuard, giúp kiểm tra quyền truy cập của người dùng trước khi thực hiện hành động.
nói chung nó như là khai báo để chèn lên thôi
*/

export function Authorization() {
    return applyDecorators(UseGuards(GqlAuthGuard))
}
