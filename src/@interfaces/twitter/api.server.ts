import { T, Twimo } from '@yarnaimo/twimo'
import { P } from 'lifts'
import { FullUser } from 'twitter-d'

const verifyCredentials = async (twimo: Twimo) => {
    return P(twimo, T.get<FullUser>('account/verify_credentials'))
}

export const twitter = {
    verifyCredentials,
}
