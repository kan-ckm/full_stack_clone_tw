import type { ConfigService } from '@nestjs/config'

// dùng để kiểm tra môi trường chạy của ứng dụng (dev hay production)
export function isDev(configService: ConfigService) {
    // dùng trong hệ thống Nestjs
    return configService.getOrThrow<string>('NODE_ENV') === 'development'
}
// cái này dễ hơn được dùng ở ngoài để fallback, tiện
export const IS_DEV_ENV = process.env.NODE_ENV === 'development'
