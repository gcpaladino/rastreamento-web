//Firebase
import Firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

let config = {
  apiKey: 'AIzaSyCDo2oRPAu6jMudbZEWjN27ly1YIZ-6_hQ',
  authDomain: 'rastreamento-ac921.firebaseapp.com',
  databaseURL: 'https://rastreamento-ac921.firebaseio.com',
  projectId: 'rastreamento-ac921',
  storageBucket: 'rastreamento-ac921.appspot.com',
  messagingSenderId: '280166758323',
  appId: '1:280166758323:web:68bb17179e02c9ea88bdc6',
  measurementId: 'G-FC3TP77ZRF'
};

let app = Firebase.initializeApp(config)
let db = app.database()
const auth = app.auth()
const firestore = app.firestore()
const coordatual = db.ref('coordatual')

export { firestore, auth, coordatual }
