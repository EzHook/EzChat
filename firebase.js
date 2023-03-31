import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from 'firebase/firestore';
import {API_KEY, API_DOMAIN, API_ID, API_STORAGE, API_SENDER, API_APPID, API_MEASUREMENT} from "@env"

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: API_DOMAIN,
    projectId: API_ID,
    storageBucket: API_STORAGE,
    messagingSenderId: API_SENDER,
    appId: API_APPID,
    measurementId: API_MEASUREMENT
  };

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const db = getFirestore(app);



export { db, auth} ;