import { appAdmin } from './_app-admin'

const storageAdmin = appAdmin.storage()
export const filesBucketAdmin = storageAdmin.bucket('files')
