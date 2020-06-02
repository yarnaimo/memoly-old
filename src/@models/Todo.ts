import { Fire } from '../@types/firebase-firestore'

export type ITodo = {
    tagIds: string[]
    title: string
    description: string
    dueDate: Fire.Timestamp
}
