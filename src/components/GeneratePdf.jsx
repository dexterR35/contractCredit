import React from "react";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";
import TextCredit from "./TextCredit";

const generatePDFBlob = async (values) => {
  const content = document.createElement("div");
  let htmlContent = `
    <h2>Title</h2>
    <p>First Name: ${values.firstName}</p>
    <p>Last Name: ${values.lastName}</p>
    <p>Phone: ${values.phone}</p>
    <p>Email: ${values.email}</p>
    <p>Signature: <img src="${values.signature}" alt="signature" style="width:200px;height:auto;"/></p>
  `;

  // Include text from TextCredit component
  const textCredit = ReactDOMServer.renderToString(<TextCredit />);
  htmlContent += textCredit;

  content.innerHTML = htmlContent;

  // Ensure the signature image is loaded before converting to PDF
  await new Promise((resolve) => {
    const img = new Image();
    img.src = values.signature;
    img.onload = resolve;
  });

  try {
    const blobB = await html2pdf().from(content).output("blob");
    return blobB;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default generatePDFBlob;
