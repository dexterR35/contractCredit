


import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

export const sendEmail = async (values, fileUrls) => {
  if (!values.email) {
    toast.error("Email address is required.");
    return;
  }

  try {
    const templateParams = {
      from_name: "ObtineCredit.ro",
      to_name: `${values.firstName} ${values.lastName}`,
      reply_to: values.email,
    };

    const serviceId = import.meta.env.VITE_REACT_APP_EMAIL_serviceId; // Update with your EmailJS service ID
    const templateId = import.meta.env.VITE_REACT_APP_EMAIL_templateId; // Update with your EmailJS template ID
    const userId = import.meta.env.VITE_REACT_APP_EMAIL_userId

    console.log('Service ID:', serviceId);
    console.log('Template ID:', templateId);
    console.log('User ID:', userId);

    const emailParams = {
      ...templateParams,
      ...{
        message_html: `
          Nume: ${values.firstName}
          Prenume: ${values.lastName}
          Telefon: ${values.phone}
          Email: ${values.email}
          download:${fileUrls};
         
        `,
        download_link: ` Contract:<a href="${fileUrls}">Download File</a><br>;`
      }
    };

    await emailjs.send(serviceId, templateId, emailParams, userId);
    toast.success("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email: ", error);
    toast.error("Error sending email");
  }
};
