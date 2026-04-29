import DeviceDetector from 'device-detector-js'
import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import type { SessionMetadata } from '../types/session-metadata.type'

import { IS_DEV_ENV } from './is-dev.util'

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

/*
Hàm này có nhiệm vụ thu thập thông tin về phiên đăng nhập của người dùng  bao gồm vị trí địa lý, thiết bị đang dùng, và địa chỉ IP
IS_DEV_ENV?
├── true  → dùng '' (chuỗi rỗng, vì dev thường là localhost)
└── false → tìm IP thật theo thứ tự ưu tiên:
    ├── cf-connecting-ip (array) → lấy phần tử đầu tiên
    ├── cf-connecting-ip (string) → dùng trực tiếp
    ├── x-forwarded-for          → lấy IP đầu tiên (trước dấu phẩy)
    └── req.ip                   → fallback cuối cùng

*/
export function getSessionMetadata(
    req: Request,
    userAgent: string
): SessionMetadata {
    const ip = IS_DEV_ENV
        ? '173.166.164.121'
        : Array.isArray(req.headers['cf-connecting-ip'])
          ? req.headers['cf-connecting-ip'][0]
          : req.headers['cf-connecting-ip'] ||
            (typeof req.headers['x-forwarded-for'] === 'string'
                ? req.headers['x-forwarded-for'].split(',')[0]
                : req.ip)

    const location = lookup(ip)
    const device = new DeviceDetector().parse(userAgent)
    // trả về một đối tượng chứa thông tin về vị trí, thiết bị và IP của người dùng
    return {
        location: {
            country:
                countries.getName(location?.country, 'en') || 'không xác định',
            city: location?.city,
            latitude: location?.ll[0] || 0,
            longitude: location?.ll[1] || 0
        },
        device: {
            browser: device?.client?.name || 'không xác định',
            os: device?.os?.name || 'không xác định',
            type: device?.device?.type || 'không xác định'
        },
        ip: ip || 'unknown'
    }
}
