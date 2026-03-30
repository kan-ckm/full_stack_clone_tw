import { Field, InputType } from '@nestjs/graphql'
import {
    IsNotEmpty,
    IsString,
    MinLength
} from 'class-validator'

//định nghĩa xem đầu vào đăng nhập cho User là gì
@InputType()
export class LoginInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    public login: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string
}
