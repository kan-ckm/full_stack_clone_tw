import type { Request, Response } from "express"
// khai báo biến chứa req và res cuar express để graphql dùng
export interface GqlContext {
    req: Request
    res:Response
}