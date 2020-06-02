import * as admin from 'firebase-admin'
import { firestore } from 'firebase/app'

export namespace Fire {
    export type Env<F, W, A> = F extends firestore.Firestore ? W : A
    export type DocumentValue =
        | DocumentObject
        | string
        | number
        | boolean
        | null
        | Date
        | DocumentValue[]
        | Timestamp
        | DocumentRef<DocumentObject>

    export type DocumentObject = { [key: string]: DocumentValue }

    export type DocumentMeta = {
        _createdAt: Timestamp
        _updatedAt: Timestamp
    }

    type WDocField<T, F extends Firestore = Firestore> = T extends Timestamp
        ? Timestamp<F>
        : T

    export type WDocData<T, F extends Firestore = Firestore> = {
        [K in keyof T]: WDocField<T[K], F> | FieldValue<F>
    }

    export type Root<F extends Firestore> = {
        instance: F
        FieldValue: FieldValueClass
        Timestamp: TimestampClass
    }

    export type Firestore = firestore.Firestore | admin.firestore.Firestore

    export type FieldValue<F extends Firestore = Firestore> = Env<
        F,
        firestore.FieldValue,
        admin.firestore.FieldValue
    >
    export type Timestamp<F extends Firestore = Firestore> = Env<
        F,
        firestore.Timestamp,
        admin.firestore.Timestamp
    >

    export type FieldValueClass =
        | typeof firestore.FieldValue
        | typeof admin.firestore.FieldValue
    export type TimestampClass =
        | typeof firestore.Timestamp
        | typeof admin.firestore.Timestamp

    export type SetOptions = firestore.SetOptions | FirebaseFirestore.SetOptions
    export type DocumentData =
        | firestore.DocumentData
        | admin.firestore.DocumentData
    export type CollectionRef<T, F extends Firestore = Firestore> = Env<
        F,
        firestore.CollectionReference<T>,
        admin.firestore.CollectionReference<T>
    >
    export type Query<T, F extends Firestore = Firestore> = Env<
        F,
        firestore.Query<T>,
        admin.firestore.Query<T>
    >
    export type FirestoreDataConverter<
        T,
        F extends Firestore = Firestore
    > = Env<
        F,
        firestore.FirestoreDataConverter<T>,
        FirebaseFirestore.FirestoreDataConverter<T>
    >

    export type DocumentRef<T, F extends Firestore = Firestore> = Env<
        F,
        firestore.DocumentReference<T>,
        admin.firestore.DocumentReference<T>
    >
    export type DocumentSnap<T, F extends Firestore = Firestore> = Env<
        F,
        firestore.DocumentSnapshot<T>,
        admin.firestore.DocumentSnapshot<T>
    >
    export type QuerySnap<T, F extends Firestore = Firestore> = Env<
        F,
        firestore.QuerySnapshot<T>,
        admin.firestore.QuerySnapshot<T>
    >
    export type QueryDocumentSnap<T, F extends Firestore = Firestore> = Env<
        F,
        firestore.QueryDocumentSnapshot<T>,
        admin.firestore.QueryDocumentSnapshot<T>
    >
    export type SnapshotOptions = firestore.SnapshotOptions

    export type SetWR<F extends Fire.Firestore> = Env<
        F,
        ReturnType<firestore.DocumentReference['set']>,
        ReturnType<admin.firestore.DocumentReference['set']>
    >
    export type CollectionProps<P, F extends Fire.Firestore> = {
        [K in keyof P]: P[K] extends (...args: infer A) => Fire.Query<infer U>
            ? (...args: A) => Query<U, F>
            : P[K]
    }
}
