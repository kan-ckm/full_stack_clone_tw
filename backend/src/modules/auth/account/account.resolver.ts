import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { AccountService } from './account.service'
import { UserModel } from './models/user.model'
import { CreateUserInput } from '../inputs/create-user.input'

//resolver nó na ná định nghĩa API
@Resolver('Account')
export class AccountResolver {
    public constructor(private readonly accountService: AccountService) {}
 // [UserModel] là trả về đúng định dạng như vậy và tên API khi gọi là 'findAllUsers'
    @Query(() => [UserModel], { name: 'findAllUsers' })
    public async findAll() {
        return this.accountService.findAll()
    }
    //
    @Mutation(()=> Boolean,{name:'createUser'})
    public async create(@Args('data')input:CreateUserInput){
        return this.accountService.create(input)
    }
}
