import { lookupTweets } from '@yarnaimo/twimo'
import { Do, FilterNonNull, MapAsync, PP, Result } from 'lifts'
import { R } from '../../../../lib/fp'
import { sig } from '../../../../lib/sig'
import { dbAdmin } from '../../../@infrastructure/firebase/firestore-admin'
import { filesBucketAdmin } from '../../../@infrastructure/firebase/storage-admin'
import { twimo } from '../../../@infrastructure/twitter/twimo'
import { api, ApiHandler } from '../../../@interfaces/api/routes'
import { atomsInterface } from '../../../@interfaces/db/interfaces'
import { saveTweetMedia } from '../../../@interfaces/storage/tweet'
import { lightenTweet } from '../../../@utils/twitter'

const handler: ApiHandler['/atoms/saveTweets'] = async ({
    tagIds,
    tweetIds: requestedTweetIds,
}) => {
    const atoms = atomsInterface(dbAdmin)

    const existingTweetEntries = await PP(
        requestedTweetIds,
        R.chunk(10),
        MapAsync((tweetIds) => atoms.tweetsByTweetIds(tweetIds).get()),

        R.flatMap(R.prop('docs')),
        R.map((doc) => ({
            docId: doc.id,
            tweetId: doc.data().tweetId,
        })),
    )

    const tweetIdsToSave = R.difference(
        requestedTweetIds,
        R.map(existingTweetEntries, R.prop('tweetId')),
    )

    const savedTweetEntries = await PP(
        tweetIdsToSave,
        R.chunk(50),
        MapAsync((tweetIds) => lookupTweets(twimo, tweetIds)),
        R.flatten(),

        MapAsync((tweet) =>
            Do(async () => {
                const mediaList = await saveTweetMedia(
                    filesBucketAdmin,
                    tweet.extended_entities,
                )
                const ltweet = lightenTweet(dbAdmin.Timestamp, tweet, mediaList)

                const ref = atoms.ref.doc()
                await atoms.create(ref, {
                    type: 'tweet',
                    tagIds,
                    ...ltweet,
                })

                return {
                    docId: ref.id,
                    tweetId: ltweet.tweetId,
                }
            }).catch((error) => {
                sig.error(error)
                return null
            }),
        ),
        FilterNonNull,
    )

    return Result.ok({
        docIds: R.map(
            [...existingTweetEntries, ...savedTweetEntries],
            R.prop('docId'),
        ),
    })
}

export default api['/atoms/saveTweets'](handler, ({ tweetIds, ...rest }) => ({
    tweetIds: R.uniq(tweetIds),
    ...rest,
}))
