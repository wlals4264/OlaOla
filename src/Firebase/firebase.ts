import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBB08bs5pR84Iazh5H__hD4h0wbdJ6vq4A',
  authDomain: 'olaola-b097f.firebaseapp.com',
  projectId: 'olaola-b097f',
  storageBucket: 'olaola-b097f.firebasestorage.app',
  messagingSenderId: '632468279095',
  appId: '1:632468279095:web:db440074f01b1bc099d4b2',
  measurementId: 'G-EBST0R5Q8D',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, analytics };
