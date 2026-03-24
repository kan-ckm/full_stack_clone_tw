//Hàm dùng để chuyển từ giá trị thường "string" một là "true 2 là false dạng chuỗi"  thành kiểu boolean
// thiết lập cho tham số đầu vào là string và trả về là kiểu boolean 
export function parseBoolean(value: string): boolean {  

    if (typeof value === 'boolean') {
        return value
    }

    if (typeof value === 'string') {
        const lowerValue = value.trim().toLocaleLowerCase()

        if (lowerValue === 'true') {
            return true
        }

        if (lowerValue === 'false') {
            return false
        }
    }

    throw new Error(
        `Không thể chuyển đổi giá trị "${value}" thành kiểu boolean`
    )
}
