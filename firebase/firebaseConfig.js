import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWgA-5ZjP5trBDVsPlv2sMW0uWeRE7u7o",
  authDomain: "clubsdashbord.firebaseapp.com",
  projectId: "clubsdashbord",
  storageBucket: "clubsdashbord.appspot.com",
  messagingSenderId: "45211346178",
  appId: "1:45211346178:web:17891398f9394496844e1b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


 

