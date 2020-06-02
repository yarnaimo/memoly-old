import { firestore } from 'firebase/app'
import { app } from './_app-web'

const instance = app.firestore()

const FieldValue = firestore.FieldValue
const Timestamp = firestore.Timestamp

export const dbWeb = {
    instance,
    FieldValue,
    Timestamp,
}
