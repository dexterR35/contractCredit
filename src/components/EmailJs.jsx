


import emailjs from 'emailjs-com';


export const sendEmail = async (values, fileUrls) => {
  if (!values.email) {

    return;
  }

  try {
    const templateParams = {
      from_name: "Obtinecredit.ro",
      to_name: `${values.firstName} ${values.lastName}`,
      reply_to: values.email,
    };

    const serviceId = import.meta.env.VITE_REACT_APP_EMAIL_serviceId; // Update with your EmailJS service ID
    const templateId = import.meta.env.VITE_REACT_APP_EMAIL_templateId; // Update with your EmailJS template ID
    const userId = import.meta.env.VITE_REACT_APP_EMAIL_userId

    console.log('Service ID:', "Done");
    console.log('Template ID:', "Done");
    console.log('User ID:', "Done");

    const emailParams = {
      ...templateParams,
      ...{
        // message_html: `
        //  ${values.firstName} ${values.lastName}
        // `,
        download_link: `${fileUrls}`
      }
    };

    await emailjs.send(serviceId, templateId, emailParams, userId);
    console.log("Email sent successfully!", values.email);
  } catch (error) {
    console.error("Error sending email: ", error);

  }
};
