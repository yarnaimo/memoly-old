import { firestore } from 'firebase/app'
import { HasIsEqual } from 'react-firebase-hooks/firestore/dist/util'
import { day, Dayjs } from '../../../lib/date'
import { sig } from '../../../lib/sig'
import { use } from '../hooks'

type RefHook<T> = {
    current: T
}

export const useComparatorRef = <T>(
    value: T | null | undefined,
    isEqual: (v1: T | null | undefined, v2: T | null | undefined) => boolean,
    onChange?: () => void,
): RefHook<T | null | undefined> => {
    const ref = use.ref(value)
    use.effect(() => {
        if (!isEqual(value, ref.current)) {
            ref.current = value
            if (onChange) {
                onChange()
            }
        }
    })
    return ref
}

const isEqual = <T extends HasIsEqual<T>>(
    v1: T | null | undefined,
    v2: T | null | undefined,
): boolean => {
    const bothNull: boolean = !v1 && !v2
    const equal: boolean = !!v1 && !!v2 && v1.isEqual(v2)
    return bothNull || equal
}

export const useIsEqualRef = <T extends HasIsEqual<T>>(
    value: T | null | undefined,
    onChange?: () => void,
): RefHook<T | null | undefined> => {
    return useComparatorRef(value, isEqual, onChange)
}

export type UseTDocument<T> = {
    data: T | undefined
    snap: firestore.DocumentSnapshot<T> | undefined
    loading: boolean
    error: Error | undefined
}

export const useRefChangeLimitExceeded = (
    ref: HasIsEqual<any> | null | undefined,
) => {
    const [timestamps, setTimestamps] = use.state<Dayjs[]>([])

    useIsEqualRef(ref, () => {
        setTimestamps((prev) => [day(), ...prev])
    })

    const exceeded = () => {
        const a = !!timestamps[3]?.isAfter(day().subtract(3, 'second'))
        const b = !!timestamps[5]?.isAfter(day().subtract(5, 'second'))
        return a || b
    }

    if (exceeded()) {
        sig.fatal(
            '%cRef change limit Exceeded!!!',
            'font-weight: bold; font-size: large; color: red;',
        )
    }

    return { exceeded, timestamps }
}
