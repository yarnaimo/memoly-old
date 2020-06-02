import { t } from '../../../lib/type'
import { useRoute } from './use-route'

export const api = {
    '/atoms/createBookmark': useRoute(
        {
            tagIds: t.Array(t.String),
            url: t.String,
        },
        {
            docId: t.String,
        },
    ),
    '/atoms/saveTweets': useRoute(
        {
            tagIds: t.Array(t.String),
            tweetIds: t.Array(t.String),
        },
        {
            docIds: t.Array(t.String),
        },
    ),
}

export type ApiHandler = {
    [K in keyof typeof api]: typeof api[K]['__handler__']
}
