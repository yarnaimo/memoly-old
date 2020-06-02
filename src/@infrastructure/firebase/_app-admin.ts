import * as admin from 'firebase-admin'

let serviceAccount: any

// try {
if (process.env.APP_ENV === 'live') {
    serviceAccount = require('../../.config/firebase-admin-live.json')
} else {
    serviceAccount = require('../../.config/firebase-admin.json')
}
// } catch (error) {}

export const appAdmin = admin.apps.length
    ? admin.app()
    : serviceAccount
    ? admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: `gs://${serviceAccount.project_id}.appspot.com`,
      })
    : admin.initializeApp()
