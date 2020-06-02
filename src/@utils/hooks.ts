import { useRouter } from 'next/router'
import { Dispatch, MutableRefObject, SetStateAction } from 'react'
import { useList } from 'react-use'
import { ulid } from 'ulid'
import { useMedia } from 'use-media'
import { _use } from '../../lib/hooks'
import { is } from '../../lib/type'
import { responsive } from './css'

export const useResponsive = () => {
    const isMobile = useMedia(responsive.isMobile)
    const isNarrow = useMedia(responsive.isNarrow)

    const appbarHeight = isMobile ? 68 : 72

    return { isMobile, isNarrow, appbarHeight }
}

export const useArray = <T extends any>(initialList?: T[]) => {
    const [value, actions] = useList(initialList)
    return { value, ...actions }
}

export const useQueryParam = (key: string) => {
    const router = useRouter()
    const value = router.query[key] || ''

    const set = (newValue: string | string[]) => {
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, [key]: newValue },
            },
            undefined,
            { shallow: true },
        )
    }

    return { value, set }
}

export const useQueryParams = <
    T extends { [key: string]: string | string[] | undefined }
>(
    defaultParams: T,
) => {
    const router = useRouter()
    const params = { ...defaultParams, ...(router.query as Partial<T>) }

    const setParams = (newValues: Partial<T>) => {
        router.push(
            {
                pathname: router.pathname,
                query: { ...router.query, ...newValues },
            },
            undefined,
            { shallow: true },
        )
    }

    return { router, params, setParams }
}

// export const OmitProperty = Symbol('omit')

// export const mapObject = <S extends { [s: string]: any }>(sourceObj: S) => {
//     return <T extends { [_ in keyof S]?: any }>(
//         fn: (key: keyof S, value: S[string]) => T[string] | typeof OmitProperty,
//     ) => {
//         return Object.entries(sourceObj).reduce((newObj, [key, value]) => {
//             const newValue = fn(key, value)

//             return newValue === OmitProperty
//                 ? newObj
//                 : { ...newObj, [key]: newValue }
//         }, {} as T)
//     }
// }

//

const valueSet = <T>(initial: T): Use.ValueSet<T> => {
    const [value, set] = _use.state(initial)
    return _use.memo(() => {
        return {
            value,
            set,
        }
    }, [value, set])
}

const bool = (initial: boolean) => {
    const [value, set] = _use.state(initial)
    return _use.memo(
        () => ({
            value,
            on: () => set(true),
            off: () => set(false),
            set: (newState: boolean) => set(newState),
            toggle: () => set(!value),

            run: async <T>(fn: () => Promise<T>) => {
                set(true)
                const res = await fn()
                set(false)
                return res
            },
        }),
        [value, set],
    )
}

//

type HTMLControlElement =
    | HTMLButtonElement
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement

// type ControlHTMLAttributes = HTMLAttributes<HTMLControlElement>

export type ControlBase<T> = {
    get: () => T
    isValid: boolean
}

export const resetter = () => {
    const updateFlags: MutableRefObject<boolean[]> = _use.ref<boolean[]>([])
    const resetFlagId: Use.ValueSet<string> = valueSet('')
    const count = valueSet(0)

    const register = () => {
        const prevCount = count.value
        count.set(prevCount + 1)
        return prevCount
    }

    const checkUpdated = () => updateFlags.current.some((flag) => flag)

    const reset = () => {
        resetFlagId.set(ulid())
    }

    const setUpdateFlag = (index: number, flag: boolean) => {
        updateFlags.current[index] = flag
    }

    return {
        reset,
        register,
        checkUpdated,
        setUpdateFlag,
        resetFlagId,
    }
}

const valueWithExternal = <T>(
    resetter: Use.Resetter | null,
    initial: T,
    externalValue: T | undefined,
) => {
    const { value, set } = valueSet(initial)
    const isUpdated = value !== externalValue
    console.log({ value, externalValue, isUpdated })

    const resetWithExternal = () => {
        if (!is.undefined(externalValue)) {
            set(externalValue)
        }
    }

    const [index, setIndex] = _use.state<number | null>(null)

    _use.effectOnce(() => {
        if (resetter) {
            setIndex(resetter.register())
        }
    })

    _use.effect(() => {
        resetWithExternal()
    }, [externalValue, resetter?.resetFlagId.value])

    _use.effect(() => {
        if (resetter && is.number(index)) {
            resetter.setUpdateFlag(index, isUpdated)
        }
    }, [isUpdated])

    return _use.memo(
        () => ({
            value,
            set,
            isUpdated,
        }),
        [value, set, isUpdated],
    )
}

const createUseControl = <E extends HTMLControlElement, K extends keyof E>(
    key: K,
) => <A extends Partial<E>>(
    resetter: Use.Resetter | null,
    initial: E[K],
    externalValue: E[K] | undefined,
    defaultAttrs?: A,
) => {
    const inputRef = _use.ref<E>(null)
    const { value, set, isUpdated } = valueWithExternal(
        resetter,
        initial,
        externalValue,
    )

    const [isValid, setValidity] = _use.state(false)

    _use.effect(() => {
        setValidity(inputRef.current?.checkValidity() ?? false)
    }, [value])

    const attrs = _use.memo(
        () => ({
            ...defaultAttrs,

            inputRef,
            [key]: value,
            onChange: ({ currentTarget: t }: React.FormEvent<E>) => {
                set(t[key])
            },
        }),
        [inputRef, value, set, setValidity],
    )

    return _use.memo(
        () => ({
            value,
            set,
            isValid,
            isUpdated,
            attrs,
        }),
        [value, set, isValid, isUpdated, attrs],
    )
}

const input = createUseControl<HTMLInputElement, 'value'>('value')
const switcher = createUseControl<HTMLInputElement, 'checked'>('checked')

//

export namespace Use {
    export type ValueSet<T> = { value: T; set: Dispatch<SetStateAction<T>> }
    export type Resetter = ReturnType<typeof resetter>
    export type Bool = ReturnType<typeof bool>
    export type Input = ReturnType<typeof input>
    export type Switcher = ReturnType<typeof switcher>
}

export const use = {
    ..._use,

    valueSet,
    resetter,
    valueWithExternal,
    bool,
    input,
    switcher,
}
