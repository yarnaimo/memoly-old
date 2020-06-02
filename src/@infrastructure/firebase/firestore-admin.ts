import * as admin from 'firebase-admin'
import { appAdmin } from './_app-admin'

const instance = appAdmin.firestore()

const FieldValue = admin.firestore.FieldValue
const Timestamp = admin.firestore.Timestamp

export const dbAdmin = {
    instance,
    FieldValue,
    Timestamp,
}
