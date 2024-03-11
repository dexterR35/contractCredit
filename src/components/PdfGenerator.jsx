import React, { useState, useEffect } from 'react';
import { useFormData } from '../context/FormDataContext';
import { contractSections } from './TextObject';
import html2pdf from 'html2pdf.js';

const MyDocument = () => {
  const { formData } = useFormData() || {};
  const [dataLoaded, setDataLoaded] = useState(false);
  const [signatureData, setSignatureData] = useState(null);

  useEffect(() => {
    if (formData) {
      setDataLoaded(true);
      downloadSignatureImage(formData.signature); // Download signature image when form data is loaded
    }
  }, [formData]);

  const downloadSignatureImage = async (signature) => {
    try {
      const response = await fetch(signature);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureData(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error downloading signature image:', error);
    }
  };
  const handleDownloadPdf = () => {
   
      const content = document.createElement('div');
  
      // Construct the HTML content
      let htmlContent = `
        <h2>Title</h2>
        ${contractSections.map(section => `
          <h3>${section.title}</h3>
          ${section.items.map(item => `<p>${item}</p>`).join('')}
        `).join('')}
        .<div style="display:flex;flex-direction:row; justify-content:space-between; align-items:center;">
        <p style="text-transform:capitalize">${formData.firstName} ${formData.lastName}</p>
        <img src="${formData.signature}" alt="signature" style="width:200px;height:auto;"/>
        </div> 
      `;
  
      // Set the HTML content to the created div
      content.innerHTML = htmlContent;
  
      // Convert HTML content to PDF
      html2pdf(content, {
        filename: 'document.pdf',
        margin: [10, 10, 10, 10], // Top, Right, Bottom, Left
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      });
    
  };

  return (
    <>
      {dataLoaded && (
        <button onClick={handleDownloadPdf}>Download PDF</button>
      )}
    </>
  );
};

export default MyDocument;
