
import { db, storage } from "./FirebaseConfig";
import { doc, setDoc, collection,serverTimestamp} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import generatePDFBlob from "../components/GeneratePdf";
import {sendEmail} from "../components/EmailJs"

export const saveFormDataWithFiles = async (formData, filesInfo) => {
  
  const docRef = doc(collection(db, "contracts"));
  
  try {
    
    // Generate PDF blob
    const pdfBlob = await generatePDFBlob(formData);
    // Upload PDF to Firebase Storage
    const pdfPath = `contracts/${docRef.id}/${formData.firstName}_${formData.lastName}_contract.pdf`;
    const pdfRef = ref(storage, pdfPath);
    await uploadBytes(pdfRef, pdfBlob);

    // Get download URL of uploaded PDF
    const pdfUrl = await getDownloadURL(pdfRef);
    console.log(pdfUrl,"opdf")
    // Prepare updates for other files
    const updates = {};
       // Prepare names and path /download/upload other files
    for (const fieldName in filesInfo) {
      const fileDetails = filesInfo[fieldName];
      if (fileDetails.file && fieldName !== "pdf") {
        console.log(`Uploading ${fieldName}...`);
        const filePath = `contracts/${docRef.id}/${fileDetails.pname}`;
        const fileRef = ref(storage, filePath);
        const snapshot = await uploadBytes(fileRef, fileDetails.file);
        const fileUrl = await getDownloadURL(snapshot.ref);
        updates[fieldName] = fileUrl;
     
        console.log(`${fieldName} uploaded successfully:`, fileUrl);
      }
    }
     
    // Save form data along with PDF URL and other file URLs to Firestore
    const data = { ...formData, pdfUrl, ...updates, timeStamp: serverTimestamp() };
    // Save the merged data to the Firestore document
    await setDoc(docRef, data);
    await sendEmail(formData, pdfUrl, updates); 
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error saving form data:", error);
    throw error;
  }
};
