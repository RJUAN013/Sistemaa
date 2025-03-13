import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, increment } from 'firebase/database';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "https://sistema-de-saude-af50c-default-rtdb.firebaseio.com/",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;

// Função para obter o próximo ID
export const getNextId = async () => {
  const nextIdRef = ref(database, 'nextId');
  const snapshot = await get(nextIdRef);
  if (snapshot.exists()) {
    const nextId = snapshot.val();
    await set(nextIdRef, increment(1));
    return nextId;
  } else {
    await set(nextIdRef, 2); // Inicializa o próximo ID como 2, já que estamos usando 1 como o primeiro ID
    return 1;
  }
};
