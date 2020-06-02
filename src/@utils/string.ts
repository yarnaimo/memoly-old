export const withTrimmedString = <T>(fn: (str: string) => T) => {
    return (str: string) => fn(str.trim())
}
