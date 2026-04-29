import { Field, ID, ObjectType } from '@nestjs/graphql'

import type { User } from '@/prisma/generated'

// định dạng khi query api thì sẽ lấy những gì cho client
@ObjectType()
export class UserModel implements User {
    @Field(() => ID)
    public id: string

    @Field(() => String)
    public email: string
    @Field(() => String)
    public password: string

    @Field(() => String)
    public username: string
    @Field(() => String)
    public displayName: string

    // nullable là có thể rỗng
    @Field(() => String, { nullable: true })
    public avatar: string
    @Field(() => String, { nullable: true })
    public bio: string

    @Field(() => Date)
    public createdAt: Date
    @Field(() => Date)
    public updatedAt: Date
}
