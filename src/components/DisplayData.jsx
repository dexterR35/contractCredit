import React, { useEffect, useState } from "react";
import { db } from "../services/FirebaseConfig"; // Adjust the path as necessary
import { collection, getDocs } from "firebase/firestore";

const DisplayData = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      const contractCollectionRef = collection(db, "contracts");
      const contractSnapshot = await getDocs(contractCollectionRef);
      const contractList = contractSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContracts(contractList);
    };

    fetchContracts();
  }, []);

  return (
    <div>
      {contracts.map((contract) => (
        <div key={contract.id} style={{ marginBottom: "20px" }}>
          <h2>
            {contract.firstName} {contract.lastName}
          </h2>
          <p>Phone: {contract.phone}</p>
          <p>Email: {contract.email}</p>
          {contract.photo && (
            <img
              src={contract.photo}
              alt="Uploaded"
              style={{ width: "100px", height: "100px" }}
            />
          )}
          {contract.signature && (
            <img
              src={contract.signature}
              alt="Signature"
              style={{ width: "200px", height: "100px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayData;
