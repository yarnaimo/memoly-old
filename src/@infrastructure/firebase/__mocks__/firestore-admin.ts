import {
    clearFirestoreData,
    firestore,
    initializeAdminApp,
} from '@firebase/testing'

const projectId = 'memoly-test'
const appAdmin = initializeAdminApp({ projectId })

const instance = appAdmin.firestore()

const FieldValue = firestore.FieldValue
const Timestamp = firestore.Timestamp

export const dbAdmin = {
    instance,
    FieldValue,
    Timestamp,
}

// export const dbAdmin = DBRepository(
//     Object.assign(dbInstanceAdmin, {
//         getAll: (...refs: admin.firestore.DocumentReference<any>[]) => {
//             return Promise.all(refs.map((ref) => ref.get()))
//         },
//     }),
// )

afterEach(async () => {
    await clearFirestoreData({ projectId })
})

afterAll(async () => {
    await appAdmin.delete()
})
