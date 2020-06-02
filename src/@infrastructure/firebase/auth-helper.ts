import firebase from 'firebase/app'
import { auth } from './auth-web'

export const authProvider = new firebase.auth.TwitterAuthProvider()
export const emailForSignInKey = 'emailForSignIn'

const handleLoginResult = ({
    credential,
    user,
    additionalUserInfo,
}: firebase.auth.UserCredential) => {
    if (!credential || !user || !additionalUserInfo) {
        return
    }

    return {
        loginTmp: {
            credential: {
                token: (credential as any).accessToken as string,
                tokenSecret: (credential as any).secret as string,
            },
            screenName: additionalUserInfo.username!,
        },
        user,
    }
}

export const loginWithTwitter = async () => {
    const res = await auth.signInWithPopup(authProvider)
    return handleLoginResult(res)
}

export const linkWithTwitter = async (currentUser: firebase.User) => {
    await currentUser.unlink(authProvider.providerId)
    const res = await currentUser.linkWithPopup(authProvider)
    return handleLoginResult(res)
}
