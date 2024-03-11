import React from "react";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";
import TextCredit from "./TextCredit";

const generatePDFBlob = async (values) => {
  const content = document.createElement("div");
  const textCredit = ReactDOMServer.renderToString(<TextCredit />);
  let htmlContent = `
<style>
.container_bottom {
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  width:100%;
  gap:20px;
}
.signature_container {
  display:flex;justify-content:center;flex-direction:row;align-items:center;
}
// .name_container {
//   background:red;
//   width:fit-content;
// }
// .signature_container{
//   background:cyan;
//   width:fit-content;
// }

</style>


  <div class="pdf-container">
    <h2 style="text-align:center; width:100%">Title</h2>
    <br/>
    ${textCredit}
    <br/>
    <div class="container_bottom">
      <div class="name_container"><span>Nume:</span> <span>${values.firstName} ${values.lastName}</span></div>
      <div class="signature_container"><span>Semnatura:</span><img src="${values.signature}" alt="signature" style="width:150px;height:auto;"/></div>
    </div>
  </div>
  `;

  // Include text from TextCredit component

  content.innerHTML = htmlContent;

  // Ensure the signature image is loaded before converting to PDF
  await new Promise((resolve) => {
    const img = new Image();
    img.src = values.signature;
    img.onload = resolve;
  });


    try {
      const options = {
          margin: [15, 15, 20, 15], // in mm
          filename: 'document.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 1 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
  
      // Notice the change here from toBlob() to output('blob')
      const blobB = await html2pdf().set(options).from(content).output('blob');
      return blobB;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default generatePDFBlob;
