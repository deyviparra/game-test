import firebase_app from './config'
import { getDatabase, set, ref, onValue, get } from 'firebase/database'

const db = getDatabase(firebase_app)

export async function getDataDB(path) {
  const snapshot = await get(ref(db, path))
  if (snapshot.exists()) {
    return snapshot.val()
  } else {
    return null
  }
}

export function onDataDB(path, callback) {
  onValue(ref(db, path), (snapshot) => {
    callback(snapshot.val())
  })
}

export async function setDataDB(path, data) {
  await set(ref(db, path), data)
}
