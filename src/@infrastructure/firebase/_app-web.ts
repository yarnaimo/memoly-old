import 'firebase/analytics'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import { firebaseConfig } from '../../.config/firebase-web'

export const app = firebase.apps.length
    ? firebase.app()
    : firebase.initializeApp(firebaseConfig)
