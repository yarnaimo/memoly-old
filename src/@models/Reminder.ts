import { Type } from '../../lib/type'
import { TimeOfDay, WDay } from '../@types/date'
import { Fire } from '../@types/firebase-firestore'

type Repetition =
    | { type: 'evenInterval'; interval: number }
    | { type: 'numbers'; numbers: number[] }

type Once = {
    date: Fire.Timestamp
}

type Weekly = {
    at: {
        wdays: WDay[]
        time: TimeOfDay
    }
    repetition: Repetition | null
}

type Monthly = {
    at: {
        mdate: number
        time: TimeOfDay
    }
    repetition: Repetition | null
}

type Yearly = {
    at: {
        month: number
        mdate: number
        time: TimeOfDay
    }
}

export type IReminder = {
    tagIds: string[]
    title: string
    description: string
    since: Fire.Timestamp
    until: Fire.Timestamp
} & Type.RequireExactlyOne<{
    once: Once
    weekly: Weekly
    monthly: Monthly
    yearly: Yearly
}>
