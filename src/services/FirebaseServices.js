import { db, storage } from "./FirebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFile = async (file, path, docId) => {
  const filePath = `${path}/${docId}/${file.name}`;
  const fileRef = ref(storage, filePath);
  const snapshot = await uploadBytes(fileRef, file);
  return getDownloadURL(snapshot.ref);
};

export const saveFormData = async (data) => {
  const docRef = doc(collection(db, "contracts"));
  await setDoc(docRef, data);
  return docRef.id; // Return the document ID
};
