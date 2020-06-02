import { dbAdmin } from '../../@infrastructure/firebase/firestore-admin'
import { createCollection } from '../../@interfaces/db/collection-factory'
import { IMember, IPost, membersRefRaw } from '../_types/models'
import { expectEqualRef } from '../_utils/firestore'

export const membersInterface = createCollection<null, IMember>()({
    path: 'members',
    selectors: (ref) => ({
        shorterThan: (height: number) => ref.where('height', '<', height),
    }),
})

export const memberPostsInterface = createCollection<IMember, IPost>()({
    path: 'posts',
    selectors: (ref) => ({}),
})

const data = {
    name: 'umi',
    height: 155,
    tags: ['tag0', 'tag1'],
    timestamp: dbAdmin.FieldValue.serverTimestamp(),
}

describe('read', () => {
    test('root', () => {
        expectEqualRef(membersInterface(dbAdmin).ref, membersRefRaw as any)
    })

    test('root query', () => {
        const height = 160

        expectEqualRef(
            membersInterface(dbAdmin).shorterThan(height),
            membersRefRaw.where('height', '<', height),
        )
    })

    test('child', () => {
        const rawParent = membersRefRaw.doc('0')

        expectEqualRef(
            memberPostsInterface(dbAdmin, rawParent as any).ref,
            rawParent.collection('posts'),
        )
    })
})

describe('write', () => {
    test('create', async () => {
        const members = membersInterface(dbAdmin)
        await members.create(members.ref.doc('0'), data)

        const snap = await membersRefRaw.doc('0').get()
        expect(snap.data()).toMatchObject({
            ...data,
            _createdAt: expect.any(dbAdmin.Timestamp),
            _updatedAt: expect.any(dbAdmin.Timestamp),
            timestamp: expect.any(dbAdmin.Timestamp),
        })
    })

    test('setMerge', async () => {
        const members = membersInterface(dbAdmin)
        await membersRefRaw.doc('0').set(data as any)

        await members.setMerge(members.ref.doc('0'), {
            name: 'umi-kousaka',
            tags: dbAdmin.FieldValue.arrayUnion('tag2'),
        })

        const snap = await membersRefRaw.doc('0').get()
        expect(snap.data()).toMatchObject({
            ...data,
            name: 'umi-kousaka',
            tags: ['tag0', 'tag1', 'tag2'],
            _updatedAt: expect.any(dbAdmin.Timestamp),
            timestamp: expect.any(dbAdmin.Timestamp),
        })
    })
})
