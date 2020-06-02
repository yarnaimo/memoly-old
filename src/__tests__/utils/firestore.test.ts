import { day } from '../../../lib/date'
import { Fire } from '../../@types/firebase-firestore'
import { Combine, CreatedWithin } from '../../@utils/firebase/firestore'
import { IMember, membersRefRaw } from '../_types/models'
import { expectEqualRef } from '../_utils/firestore'

const Tags = (query: Fire.Query<IMember>) => (tagIds: string[]) =>
    query.where('tags', 'array-contains-any', tagIds)

const tagIds = ['81', '117']
const since = day('2020-01-17')
const until = day('2020-08-10')

test('CreatedWithin', () => {
    CreatedWithin(membersRefRaw)({ since })

    expectEqualRef(
        CreatedWithin(membersRefRaw)({ since }),
        membersRefRaw.where('_createdAt', '>=', since.toDate()) as any,
    )

    expectEqualRef(
        CreatedWithin(membersRefRaw)({ until }),
        membersRefRaw.where('_createdAt', '<', until.toDate()) as any,
    )

    expectEqualRef(
        CreatedWithin(membersRefRaw)({ since, until }),
        membersRefRaw
            .where('_createdAt', '>=', since.toDate())
            .where('_createdAt', '<', until.toDate()) as any,
    )
})

test('Combine', () => {
    const tags$createdWithin = Combine(membersRefRaw)(Tags, CreatedWithin)

    expectEqualRef(
        tags$createdWithin(tagIds, { since, until }),
        membersRefRaw
            .where('tags', 'array-contains-any', tagIds)
            .where('_createdAt', '>=', since.toDate())
            .where('_createdAt', '<', until.toDate()) as any,
    )
})
