import config from '../../config'
import * as firebaseApp from 'firebase'

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.messagingSenderId
};

firebaseApp.initializeApp(firebaseConfig);

const firebase  = firebaseApp.storage();
export {
firebase
}