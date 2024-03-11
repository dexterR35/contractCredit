import { db, storage } from "./FirebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const saveFormDataWithFiles = async (formData, filesInfo) => {
  // Create a new document reference in the 'contracts' collection
  const docRef = doc(collection(db, "contracts"));
  const updates = {};

  // Handle file uploads
  for (const fieldName in filesInfo) {
      const fileDetails = filesInfo[fieldName];
      if (fileDetails.file) {
          // Construct the file path to organize files under 'contracts/docRefId/files/fieldName'
          const filePath = `contracts/${docRef.id}/${fileDetails.pname}`;
          const fileRef = ref(storage, filePath);
          // Upload the file to Firebase Storage
          const snapshot = await uploadBytes(fileRef, fileDetails.file);
          // Get the URL of the uploaded file
          const fileUrl = await getDownloadURL(snapshot.ref);
          // Update the URL in the 'updates' object, which will be merged with the form data
          updates[fieldName] = fileUrl;
      }
  }

  // Merge the original form data with the file URLs
  const finalData = { ...formData, ...updates };

  // Save the merged data to the Firestore document
  await setDoc(docRef, finalData);

  // Return the document ID and the merged data
  return { id: docRef.id, ...finalData };
};
