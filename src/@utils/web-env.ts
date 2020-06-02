import { webEnvDefault } from '../../.config/web-env-default'

export type WebEnv = {
    isDevProject: boolean
    testerKeyDigest: string
    hostingOrigin: string
    stripePublicKey: string
}

export const webEnv: WebEnv = webEnvDefault
