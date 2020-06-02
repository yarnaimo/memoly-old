import { P } from 'lifts'
import { day, Dayjs } from '../../../lib/date'
import { Type } from '../../../lib/type'
import { Fire } from '../../@types/firebase-firestore'

export const _createdAt = '_createdAt'
export const _updatedAt = '_updatedAt'

type _SpanOption = { since: Dayjs; until: Dayjs }
export type SpanOption =
    | _SpanOption
    | Type.SetOptional<_SpanOption, 'since'>
    | Type.SetOptional<_SpanOption, 'until'>

export const CreatedWithin = <T>(query: Fire.Query<T>) => ({
    since,
    until,
}: SpanOption) => {
    return P(
        query,
        (q) => (since ? q.where(_createdAt, '>=', since.toDate()) : q),
        (q) => (until ? q.where(_createdAt, '<', until.toDate()) : q),
    )
}

export const Combine = <T>(collection: Fire.CollectionRef<T>) => <
    Ss extends ((collection: Fire.CollectionRef<T>) => (arg: any) => any)[]
>(
    ...Selectors: Ss
) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return (...args: { [I in keyof Ss]: Parameters<ReturnType<Ss[I]>>[0] }) => {
        return Selectors.reduce(
            (q, selector, i) => selector(q)(args[i]),
            collection,
        )
    }
}

// export const dayjsToWebTimestamp = (date: Dayjs) =>
//     webTimestamp.fromDate(date.toDate())

export const timestampToDayjs = (timestamp: Fire.Timestamp) =>
    day(timestamp.toDate())

export const timestampToDayjsN = (
    timestamp: Fire.Timestamp | null | undefined,
) => (timestamp ? timestampToDayjs(timestamp) : undefined)
