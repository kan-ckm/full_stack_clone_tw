// quy đổi tất cả về mini giây
const s = 1000
const m = s * 60
const h = m * 60
const d = h * 24
const w = d * 7
const y = d * 365.25

type Unit =
    | 'Years'
    | 'year'
    | 'Yrs'
    | 'Yr'
    | 'Y'
    | 'Weeks'
    | 'Week'
    | 'W'
    | 'Days'
    | 'Day'
    | 'D'
    | 'Hours'
    | 'Hour'
    | 'Hrs'
    | 'Hr'
    | 'H'
    | 'Minutes'
    | 'Minute'
    | 'Mins'
    | 'Min'
    | 'M'
    | 'Seconds'
    | 'Second'
    | 'Secs'
    | 'Sec'
    | 'S'
    | 'Milliseconds'
    | 'Millisecond'
    | 'Msecs'
    | 'Msec'
    | 'Ms'

type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit> //cho phép tất cả ko phân biệt hoa hay thường

export type StringValue = // cho phép input dạng '1000' '5h' '5 h'
    `${number}` | `${number}${UnitAnyCase}` | `${number} ${UnitAnyCase}`

export function ms(str: StringValue): number {
    if (typeof str !== 'string' || str.length === 0 || str.length > 100) {
        // ôn lại một chút về typeof là một toán tử trong javascript để kiểm tra kiểu dữ liệu của một biến hoặc gía trị
        throw new Error(
            'Giá trị được cung cấp cho hàm ms() phải là một chuỗi có độ dài từ 1 đến 100'
        )
    }
    // luồn regex này: định dạng => exec('tom-18')
    const match =
        /(?<value>-?(?:\d+)?\.?\d+) *(?<type>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
            str
        )

    const groups = match?.groups as { value: string; type?: string } | undefined // ép sang kiểu đã định nghĩa
    if (!groups) {
        return NaN
    }
    const n = parseFloat(groups.value)
    const type = (groups.type || 'ms').toLocaleLowerCase() as Lowercase<Unit> // nếu ko có đợn vị thì chuyển về ms và luôn chuyển về chữ thường
    // swtch phân loại để chuyển về ms
    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return n * y
        case 'weeks':
        case 'week':
        case 'w':
            return n * w
        case 'days':
        case 'day':
        case 'd':
            return n * d
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return n * h
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return n * m
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return n * s
        case 'milliseconds':
        case 'millisecond':
        case 'msecs':
        case 'msec':
        case 'ms':
            return n
        default:
            throw new Error(
                `Đơn vị thời gian của ${type} đã được nhận dạng, nhưng không có trường hợp nào giống được định sẵn, Vui lòng kiểm tra input`
            )
    }
}
ms
