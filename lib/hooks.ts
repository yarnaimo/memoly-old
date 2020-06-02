import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react'
import { useEffectOnce } from 'react-use'

export const _use = {
    effect: useEffect,
    effectOnce: useEffectOnce,
    memo: useMemo,
    cb: useCallback,
    state: useState,
    reducer: useReducer,
    ref: useRef,
}
