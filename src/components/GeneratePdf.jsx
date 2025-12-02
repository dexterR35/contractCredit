
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
  font-size:1.3em;
  font-weight:700;
  text-align:center;
  width:100%;
}
.pdf-container {
  font-family: sans-serif;
}
.pdf-container > div {
  page-break-inside: avoid;
}
.pdf-container > div  {
  margin:20px 0;
}

.pdf-container ul {
  // padding-left: 20px; /* Adjust list indentation */
  margin-top: 10px;
  margin-bottom: 6px;
}
.pdf-container li {
  font-size: 0.9em; /* Adjust font size */
  margin-bottom: 0mm; /* Adjust space between list items */
  text-align: justify; /* Justify text for better alignment */
  line-height: 1.2; /* Adjust line spacing */
  // word-break: break-word; /* Ensure long words do not overflow */
}
</style>


  <div class="pdf-container">
    <h2>Contract de Prestari Servicii</h2>
    ${textCredit}
    <div class="container_bottom">
      <div class="name_container">${values.firstName || values.lastName ? `<span>Nume:</span> <span>${values.firstName} ${values.lastName}</span> <br>` : ''} Data: ${currentDate()}</div>
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
      margin: [10, 15, 10, 15], // in mm
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 }, // in quality
      html2canvas: { scale: 1 },// 1 = 1.2mb  2 = 5mb
      precision: true,
      // compress: true,
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
