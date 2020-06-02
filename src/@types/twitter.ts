import { TwimoMediaEntity } from '@yarnaimo/twimo'
import { Fire } from './firebase-firestore'

export namespace LTweetEntity {
    export type Indices = [number, number]

    export type Hashtag = {
        indices: Indices
        text: string
    }

    export type UserMention = {
        indices: Indices
        userId: string
        screenName: string
        name: string
    }

    export type UrlBase = {
        indices: Indices
        url: string
        displayUrl: string
        expandedUrl: string
    }

    export type Url = UrlBase

    export type Stored = { storagePath: string }

    type ShallowMerge<T, U extends { [K in keyof T]?: any }> = {
        [K in keyof T]: K extends keyof U ? T[K] & U[K] : T[K]
    }

    export type Image = ShallowMerge<
        TwimoMediaEntity.Image,
        {
            thumb: Stored
            image: Stored
        }
    >
    export type Video = ShallowMerge<
        TwimoMediaEntity.Video,
        {
            thumb: Stored
            image: Stored
        }
    >
    export type Gif = ShallowMerge<
        TwimoMediaEntity.Gif,
        {
            thumb: Stored
            image: Stored
        }
    >
}

export type LTweetEntities = {
    hashtags: LTweetEntity.Hashtag[]
    userMentions: LTweetEntity.UserMention[]
    urls: LTweetEntity.Url[]
}

export type LTweetMediaList = {
    images: LTweetEntity.Image[]
    video: LTweetEntity.Video | LTweetEntity.Gif | null
}

export type LTweet = {
    tweetId: string
    tweetCreatedAt: Fire.Timestamp
    text: string
    source: string
    retweetCount: number
    favoriteCount: number

    replyToTweetId: string | null
    quotedTweetId: string | null

    user: LTweetUser
    entities: LTweetEntities
    mediaList: LTweetMediaList
}

export type LTweetUser = {
    userId: string
    screenName: string
    name: string
    description: string | null
    protected: boolean
    iconUrl: string
}
