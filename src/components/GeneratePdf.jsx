
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";
import TextCredit from "./TextCredit";
import { currentDate } from "./contractForm/Validation"


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
h2 {
  font-size:1.4em;
  font-weight:700;
  text-align:center;
  width:100%;
}
</style>


  <div class="pdf-container">
    <h2>Contract de Prestari Servicii</h2>
    <br/>
    ${textCredit}
    <br/>
    <div class="container_bottom">
      <div class="name_container"><span>Nume:</span> <span>${values.firstName} ${values.lastName}</span> <br> Data: ${currentDate()}</div>
      <div class="signature_container"><span>Semnatura:</span> <br> <img src="${values.signature}" alt="signature" style="width:150px;height:auto;"/></div>
    </div>
  </div>
  `;

  // Include text from TextCredit component

  content.innerHTML = htmlContent;

  // Ensure the signature image is loaded before converting to PDF
  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject; // Add error handling
    img.src = values.signature;
  });

  try {
    const options = {
      margin: [20, 15, 30, 15], // in mm
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
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
