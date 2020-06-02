import { IAtom } from '../../@models/Atom'
import { ITweet } from '../../@models/Atom/Tweet'
import { IReminder } from '../../@models/Reminder'
import { ITag } from '../../@models/Tag'
import { ITodo } from '../../@models/Todo'
import { Fire } from '../../@types/firebase-firestore'
import { Combine, CreatedWithin } from '../../@utils/firebase/firestore'
import { createCollection } from './collection-factory'

export const tagsInterface = createCollection<null, ITag>()({
    path: 'tags',
    selectors: () => ({}),
})

export const atomsInterface = createCollection<null, IAtom>()({
    path: 'atoms',
    selectors: (atoms) => {
        const Tags = (query: Fire.Query<IAtom>) => (tagIds: string[]) =>
            query.where('tags', 'array-contains-any', tagIds)

        const BookmarksByUrl = (query: Fire.Query<IAtom>) => (url: string) =>
            query.where('type', '==', 'bookmark').where('url', '==', url)

        const TweetsByTweetIds = (query: Fire.Query<IAtom>) => (
            ids: string[],
        ) =>
            query
                .where('type', '==', 'tweet')
                .where('tweetId', 'in', ids) as Fire.Query<ITweet>

        return {
            byTags: Tags(atoms),
            createdWithin: CreatedWithin(atoms),
            byTags$createdWithin: Combine(atoms)(Tags, CreatedWithin),
            bookmarksByUrl: BookmarksByUrl(atoms),
            tweetsByTweetIds: TweetsByTweetIds(atoms),
        }
    },
})

export const todosInterface = createCollection<null, ITodo>()({
    path: 'todos',
    selectors: () => ({}),
})

export const remindersInterface = createCollection<null, IReminder>()({
    path: 'reminders',
    selectors: () => ({}),
})
