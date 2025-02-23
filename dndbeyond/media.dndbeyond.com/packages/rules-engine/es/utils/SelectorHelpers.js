export function getArrayOrNullFallback(value) {
    let fallback = [];
    return value === null ? fallback : value;
}
