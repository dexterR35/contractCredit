
import React from 'react';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';

const EmailSender = ({ formValues, signatureDataUrl }) => {

  const sendEmail = async () => {
    if (!formValues.email) { // Ensure there is an email to send to
      toast.error("Email address is required.");
      return;
    }

    try {
      const templateParams = {
        from_name: `${formValues.firstName} ${formValues.lastName}`,
        to_name: "Recipient Name", // Replace with recipient's name if available or use a static name
        message_html: "Here you can include additional text or form values",
        reply_to: formValues.email,
        signature_image: signatureDataUrl, // Make sure this is a URL or a base64 string if supported
      };

      // Replace 'service_66zfxbl', 'template_28hl07u', and '0LuwZPt-8aGtf94ka' with your actual EmailJS details
      await emailjs.send('service_66zfxbl', 'template_28hl07u', templateParams, '0LuwZPt-8aGtf94ka');
      toast.success("Email sent successfully!");

    } catch (error) {
      console.error("Error sending email: ", error);
      toast.error("Error sending email");

      
    }
  };

  return (
    <button onClick={sendEmail}>Send Email</button>
  );
};

export default EmailSender;
