import { Bucket } from '@google-cloud/storage'
import { getMediaList, TwimoFragment } from '@yarnaimo/twimo'
import { Do, MapAsync } from 'lifts'
import { ExtendedEntities } from 'twitter-d'
import { got } from '../../../lib/http'
import { LTweetEntity, LTweetMediaList } from '../../@types/twitter'
import { as } from '../../@utils/type'
import { uploadFile } from './file'

const saver = (bucket: Bucket) => async <
    F extends TwimoFragment.Image | TwimoFragment.Video
>(
    fragment: F,
) => {
    const {
        headers: { 'content-type': mimeType },
        body: buffer,
    } = await got.get(fragment.url, { responseType: 'buffer' })

    const { storagePath } = await uploadFile(bucket, buffer, mimeType!)

    return {
        ...fragment,
        storagePath,
    }
}

export const saveTweetMedia = async (
    bucket: Bucket,
    extended_entities: ExtendedEntities | null | undefined,
): Promise<LTweetMediaList> => {
    const save = saver(bucket)

    const twimoMediaList = getMediaList(extended_entities)

    const images = await MapAsync(
        twimoMediaList.images,
        async ({ type, thumb, image }) => {
            return as<LTweetEntity.Image>({
                type,
                thumb: await save(thumb),
                image: await save(image),
            })
        },
    )

    const video = await Do(async () => {
        if (!twimoMediaList.video) {
            return null
        }
        const { type, thumb, video } = twimoMediaList.video
        return as<LTweetEntity.Video | LTweetEntity.Gif>({
            type,
            thumb: await save(thumb),
            video: await save(video),
        })
    })

    return { images, video }
}
