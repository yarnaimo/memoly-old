declare namespace NodeJS {
    interface ProcessEnv {
        readonly twitterConsumerKey: string
        readonly twitterConsumerSecret: string

        readonly driveFolderId: string
    }
}
