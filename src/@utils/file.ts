import { createHash } from 'crypto'

export const getHash = (buffer: Buffer) => {
    const hash = createHash('sha256')
    hash.update(buffer)
    return hash.digest('hex')
}
