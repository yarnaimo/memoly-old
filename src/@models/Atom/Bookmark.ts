export type PlayerProvider = 'youtube'

import getYoutubeId from 'get-youtube-id'
import { P, R } from '../../../lib/fp'

export type IBookmark = {
    type: 'bookmark'
    tagIds: string[]
    title: string
    description: string | null
    host: string
    url: string
    imageUrl: string | null
    playerProvider: PlayerProvider | null
}

export const playerProviderMatchers: [
    PlayerProvider,
    (url: string) => boolean,
][] = [['youtube', (url) => !!getYoutubeId(url)]]

export const getPlayerProvider = (url: string) => {
    return P(
        playerProviderMatchers,
        R.find(([name, fn]) => fn(url)),
        (matched) => matched?.[0] ?? null,
    )
}
