import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCKOM8Tov7jcmlNgZ5EuRyat2l791hm6nM",
  authDomain: "sorex-bcade.firebaseapp.com",
  projectId: "sorex-bcade",
  storageBucket: "sorex-bcade.appspot.com",
  messagingSenderId: "428693429265",
  appId: "1:428693429265:web:b38ab9c0f26a026cc8e5b0",
  measurementId: "G-QCWT0DSEL6",
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
