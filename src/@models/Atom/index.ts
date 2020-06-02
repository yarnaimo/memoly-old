import { as } from '../../@utils/type'
import { IBookmark } from './Bookmark'
import { INote } from './Note'
import { ITweet } from './Tweet'

export type IAtom = INote | IBookmark | ITweet

const __ = (str: string) => `__${str}`

const generateBody = (atom: IAtom) => {
    switch (atom.type) {
        case 'note':
            return [__(atom.type), atom.title, atom.body]

        case 'bookmark':
            return [
                __(atom.type),
                atom.title,
                atom.description,
                atom.url,
                atom.host,
            ]

        case 'tweet':
            return [
                __(atom.type),
                atom.entities.images.length ? '__tweet_with_image' : '',
                atom.entities.video ? '__tweet_with_video' : '',
                atom.user.screenName,
                atom.user.name,
                atom.user.userId,
                atom.text,
            ]

        default:
            as<never>(atom)
            return []
    }
}

export const generateAtomIndex = (atom: IAtom) => {
    const tags = atom.tagIds.map((id) => `__tag_${id}`).join(' ')
    const body = generateBody(atom)
    const str = [tags, ...body].join('\n')
    return str
}
