import { LTweet } from '../../@types/twitter'

export type ITweet = {
    type: 'tweet'
    tagIds: string[]
} & LTweet
