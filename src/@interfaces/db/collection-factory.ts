import { Fire } from '../../@types/firebase-firestore'
import { _createdAt, _updatedAt } from '../../@utils/firebase/firestore'

export const createCollection = <Parent extends null | object, T>() => <
    S = {}
>({
    path,
    selectors,
}: {
    path: string
    selectors: (collectionRef: Fire.CollectionRef<T>) => S
}) => <F extends Fire.Firestore>(
    ...[root, parent]: Parent extends null
        ? [Fire.Root<F>]
        : [Fire.Root<F>, Fire.DocumentRef<Parent, F>]
) => {
    // parent: Parent extends null ? F : Fire.DocumentRef<Parent, F>,
    const toCreate = (data: object) =>
        (({
            ...data,
            [_createdAt]: root.FieldValue.serverTimestamp(),
            [_updatedAt]: root.FieldValue.serverTimestamp(),
        } as any) as T)

    const toUpdate = (data: object) =>
        (({
            ...data,
            [_updatedAt]: root.FieldValue.serverTimestamp(),
        } as any) as T)

    const ref = (parent ?? root.instance).collection(
        path,
    ) as Fire.CollectionRef<T & Fire.DocumentMeta, F>

    return {
        ref,

        create(docRef: Fire.DocumentRef<T, F>, data: Fire.WDocData<T, F>) {
            const dataTs = toCreate(data)
            return docRef.set(dataTs, {}) as Fire.SetWR<F>
        },

        setMerge(
            docRef: Fire.DocumentRef<T, F>,
            data: Partial<Fire.WDocData<T, F>>,
        ) {
            const dataTs = toUpdate(data)
            return docRef.set(dataTs, { merge: true }) as Fire.SetWR<F>
        },

        ...(selectors(ref) as Fire.CollectionProps<S, F>),
    }
}
