import { Field, InputType } from '@nestjs/graphql'
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength
} from 'class-validator'

//định nghĩa xem đầu vào để tạo User là gì
@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    // có thể lên mạng lấy mẫu regex
    @Matches(/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/)
    public username: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    public email: string

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    public password: string
}
