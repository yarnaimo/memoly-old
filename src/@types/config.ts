export type ServerConfig = {
    auth: {
        adminId: string
    }

    twitter: {
        consumer: { consumerKey: string; consumerSecret: string }
        tokens: { token: string; tokenSecret: string }
    }

    googleDrive: {
        folderId: string
    }
}

export type CommonConfig = {}
