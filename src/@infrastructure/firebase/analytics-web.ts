import { app } from './_app-web'

export const analytics = typeof window !== 'undefined' && app.analytics()
