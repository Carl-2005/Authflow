import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: replace with your actual Firebase config from the console
// https://console.firebase.google.com/project/authflow-102/settings/general
const firebaseConfig = {
  apiKey:
    "BNZTsYh2MC9qiYe8QhAjCdmhWhUUu6Lvu8pBsvn8Q2Ow-vdOoBGjfEt3YvuwweVPJ17wA2tt8qGSZLFXP5DvFkA",
  authDomain: "authflow-102.firebaseapp.com",
  projectId: "authflow-102",
  storageBucket: "authflow-102.appspot.com",
  messagingSenderId: "971474417621",
  appId: "1:971474417621:web:e1425ea829e873f3122f5c",
  measurementId: "G-XXXXXXXXXX", // optional
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
