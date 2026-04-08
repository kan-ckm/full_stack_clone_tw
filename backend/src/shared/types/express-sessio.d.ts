// Mở rộng kiểu cho express-session
import 'express-session'

// dòng 5 ý nghĩa của nó là mở module để patch thêm type
declare module 'express-session' {
    interface SessionData {
        userId?: string
        createdAt?: Date | string
    }
}
