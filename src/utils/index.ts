export function bittest(num: number, bit: number) {
    return ((num >> bit) % 2 != 0)
}

export function bitset(num: number, bit: number) {
    return num | 1 << bit;
}

export function bitclear(num: number, bit: number) {
    return num & ~(1 << bit);
}

export function bittoggle(num: number, bit: number) {
    return bittest(num, bit) ? bitclear(num, bit) : bitset(num, bit);
}