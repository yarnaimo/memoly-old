import { firestore } from 'firebase/app'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore'
import { sig } from '../../../lib/sig'
import { use } from '../hooks'
import { useRefChangeLimitExceeded } from './firestore-hooks-utils'

export const useTDocument = <T>(
    docRef: firestore.DocumentReference<T> | null | undefined,
    options?: {
        snapshotListenOptions?: firestore.SnapshotListenOptions
    },
) => {
    const { exceeded } = useRefChangeLimitExceeded(docRef)

    const [snap, loading, error] = useDocument(
        exceeded() ? undefined : docRef,
        options,
    )

    use.effect(() => {
        if (error) {
            sig.error(error)
        }
    }, [error])

    const data = use.memo(() => snap?.data(), [snap])

    return {
        data: data as T | undefined,
        snap: snap as firestore.DocumentSnapshot<T> | undefined,
        loading,
        error,
    }
}

export const useTCollection = <T>(
    query: firestore.Query<T> | null | undefined,
    options?: {
        snapshotListenOptions?: firestore.SnapshotListenOptions
    },
) => {
    const { exceeded } = useRefChangeLimitExceeded(query)

    const [snap, loading, error] = useCollection(
        exceeded() ? undefined : query,
        options,
    )

    use.effect(() => {
        if (error) {
            sig.error(error)
        }
    }, [error])

    const data = use.memo(() => snap?.docs.map((doc) => doc.data()), [snap])

    return {
        data: data as T[] | undefined,
        snap: snap as firestore.QuerySnapshot<T> | undefined,
        loading,
        error,
    }
}
