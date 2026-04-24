//thông tin của user khi đăng nhập vào hệ thống, được lưu trữ trong session để phục vụ cho việc quản lý phiên làm việc của user
export interface LocationInfo {
    coutry: string
    city: string
    latidue: number
    longitude: number
}

//thiết bị của user
export interface DeviceInfo {
    browser: string
    os: string
    type: string
}
export interface SessionMetadata {
    location: LocationInfo
    device: DeviceInfo
    ip: number
}
