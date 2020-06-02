import { dbAdmin } from '../../@infrastructure/firebase/firestore-admin'
import { Fire } from '../../@types/firebase-firestore'

export type IMember = {
    name: string
    height: number
    tags: string[]
    timestamp: Fire.Timestamp
}

export type IPost = {
    title: string
    body: string
}

export const membersRefRaw = dbAdmin.instance.collection(
    'members',
) as Fire.CollectionRef<IMember>
