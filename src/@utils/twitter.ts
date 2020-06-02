import { FullStatus } from '@yarnaimo/twimo'
import { Entities, FullUser } from 'twitter-d'
import { day } from '../../lib/date'
import { R } from '../../lib/fp'
import { Fire } from '../@types/firebase-firestore'
import {
    LTweet,
    LTweetEntity,
    LTweetMediaList,
    LTweetUser,
} from '../@types/twitter'

export const lightenTweetUser = (u: FullUser): LTweetUser => {
    return {
        userId: u.id_str,
        screenName: u.screen_name,
        name: u.name,
        description: u.description ?? null,
        protected: u.protected,
        iconUrl: u.profile_image_url_https,
    }
}

export const lightenEntities = (entities: Entities) => {
    const hashtags = R.map(
        entities.hashtags ?? [],
        (e): LTweetEntity.Hashtag => ({
            indices: e.indices!,
            text: e.text,
        }),
    )

    const userMentions = R.map(
        entities.user_mentions ?? [],
        (e): LTweetEntity.UserMention => ({
            indices: e.indices as LTweetEntity.Indices,
            userId: e.id_str,
            screenName: e.screen_name,
            name: e.name,
        }),
    )

    const urls = R.map(
        entities.urls ?? [],
        (e): LTweetEntity.Url => ({
            indices: e.indices!,
            url: e.url,
            displayUrl: e.display_url!,
            expandedUrl: e.expanded_url!,
        }),
    )

    return { hashtags, userMentions, urls }
}

export const lightenTweet = (
    Timestamp: Fire.TimestampClass,
    t: FullStatus,
    mediaList: LTweetMediaList,
): LTweet => {
    return {
        tweetId: t.id_str,
        tweetCreatedAt: Timestamp.fromDate(day(t.created_at).toDate()),
        text: t.full_text,
        source: t.source,
        retweetCount: t.retweet_count,
        favoriteCount: t.favorite_count,

        replyToTweetId: t.in_reply_to_status_id_str ?? null,
        quotedTweetId: t.quoted_status_id_str ?? null,

        user: lightenTweetUser(t.user),
        entities: lightenEntities(t.entities),
        mediaList,
    }
}
