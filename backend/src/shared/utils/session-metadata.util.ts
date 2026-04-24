import type { Request } from 'express'

import type { SessionMetadata } from '../types/session-metadata.type'

import { IS_DEV_ENV } from './is-dev.util'

export function getSessionMetadata(
    req: Request,
    userAgent: string
): SessionMetadata {
    const ip = IS_DEV_ENV
        ? ''
        : Array.isArray(req.headers['cf-connecting-ip'])
          ? req.headers['cf-connecting-ip'][0]
          : req.headers['cf-connecting-ip'] ||
            typeof req.headers['x-forwarded-for'] === 'string'
    return {}
}
