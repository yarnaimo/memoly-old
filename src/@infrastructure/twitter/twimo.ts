import { Twimo } from '@yarnaimo/twimo'
import { serverConfig } from '../../.config/server-config'

export const createTwimo = Twimo(serverConfig.twitter.consumer)
export const twimo = createTwimo(serverConfig.twitter.tokens)
