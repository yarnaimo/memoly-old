import { Bucket } from '@google-cloud/storage'
import { getExtension } from 'mime'
import { getHash } from '../../@utils/file'

export const uploadFile = async (
    bucket: Bucket,
    buffer: Buffer,
    mimeType: string,
) => {
    const hash = getHash(buffer)
    const ext = getExtension(mimeType)
    const storagePath = `${hash}.${ext}`

    const ref = bucket.file(storagePath)
    const [exists] = await ref.exists()

    if (!exists) {
        await ref.save(buffer, {
            gzip: true,
            metadata: {
                contentType: mimeType,
                cacheControl: 'public, max-age=31536000',
            },
        })
    }

    return { storagePath }
}
