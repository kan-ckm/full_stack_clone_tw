import { isDev } from "@/src/shared/utils/is-dev.util";
import type { ApolloDriverConfig } from "@nestjs/apollo";
import type { ConfigService } from "@nestjs/config";
import { join } from "path";
// dùng để cấu hình sql server làm 4 việc
//bảo mật: chỉ bật playgroud khi dev và tắt khi product
// Định tuyến — xác định URL endpoint GraphQL (vd: /graphql)
// Tự động tạo schema — gen file .gql từ code TypeScript
// Chia sẻ request/response — cho các resolver biết ai đang gọi API (để xác thực token, đọc cookie,...)
export function getGraphQLConfig(
    configService: ConfigService
): ApolloDriverConfig {
    return{
        playground: isDev(configService),
        path:configService.getOrThrow<string>('GRAPQL_PREFIX'),
        autoSchemaFile: join(process.cwd(),'src/core/graphql/schema.gql'),
        sortSchema:true,
        context:({req,res})=>({req,res})
    }
}