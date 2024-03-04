


import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

export const sendEmail = async (formValues, pdfBlob) => {
  if (!formValues.email) {
    toast.error("Email address is required.");
    return;
  }

  try {
    const templateParams = {
      from_name: "ObtineCredit.ro",
      to_name: `${formValues.firstName} ${formValues.lastName}`,
      reply_to: formValues.email,
    };

    const serviceId = 'service_66zfxbl'; // Update with your EmailJS service ID
    const templateId = 'template_28hl07u'; // Update with your EmailJS template ID
    const userId = '0LuwZPt-8aGtf94ka'
    const attachment = new Blob([pdfBlob], { type: 'application/pdf' });
    const attachmentName = 'document.pdf';

    const emailParams = {
      ...templateParams,
      ...{
        message_html: `
          <p>Nume: ${formValues.firstName}</p>
          <p>Prenume: ${formValues.lastName}</p>
          <p>Telefon: ${formValues.phone}</p>
          <p>Email: ${formValues.email}</p>
        `
      }
    };

    await emailjs.send(serviceId, templateId, emailParams, { attachment, name: attachmentName }, userId);
    toast.success("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email: ", error);
    toast.error("Error sending email");
  }
};
