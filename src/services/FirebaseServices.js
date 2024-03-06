import { db, storage } from "./FirebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


let docRef = doc(collection(db, "contracts"));

export const uploadFile = async (file, path, fileName = "") => {
  const name = fileName || file.name || "signature-name";
  const filePath = `${path}/${docRef.id}/${name}`;
  const fileRef = ref(storage, filePath);
  const snapshot = await uploadBytes(fileRef, file);
  console.log("Document written with ID: ", docRef.id);
  return getDownloadURL(snapshot.ref);
  
};

export const saveFormData = async (data) => {
  await setDoc(docRef, {
    ...data,
  });
  return docRef.id;
};
