import { Field, ID, ObjectType } from '@nestjs/graphql'
// định dạng khi query api thì sẽ lấy những gì cho client
@ObjectType()
export class UserModel {
    @Field(() => ID)
    id: string

    @Field(() => String)
    email: string
    @Field(() => String)
    password: string


    @Field(() => String)
    username: string
    @Field(() => String)
    displayName: string
    
// nullable là có thể rỗng
    @Field(() => String, {nullable:true}) 
    avatar: string
    @Field(() => String, {nullable:true})
    bio: string


    @Field(() => Date)
    createdAt: Date
    @Field(() => Date)
    updatedAt: Date
}
