// Mở rộng kiểu cho express-session
import 'express-session'

import type { SessionMetadata } from './session-metadata.type'

// dòng 5 ý nghĩa của nó là mở module để patch thêm type
declare module 'express-session' {
    interface SessionData {
        userId?: string
        createdAt?: Date | string
        metadata?: SessionMetadata
    }
}
