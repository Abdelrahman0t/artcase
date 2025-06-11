'use client';
import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import styles from "./contact.module.css";
import Layout from "../fyp/layout";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const formErrors: Record<string, string> = {};
    const regexPhone = /^\+?[1-9]\d{1,14}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.firstName.trim()) formErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim()) formErrors.lastName = "Last Name is required.";
    if (!formData.email || !regexEmail.test(formData.email)) formErrors.email = "A valid email address is required.";
    if (!formData.phoneNumber || !regexPhone.test(formData.phoneNumber)) formErrors.phoneNumber = "A valid phone number is required.";
    if (!formData.message.trim()) formErrors.message = "Message is required.";

    return formErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setStatus("Submitting...");

    const templateParams = {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone_number: formData.phoneNumber,
      message: formData.message,
    };

    emailjs.send('service_yflxz0u', 'template_bjhbh65', templateParams, 'vVsKQeUHnYh3AAU5u')
      .then(() => {
        setStatus("Thank you! Your message was sent.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
        setErrors({});
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        setStatus("Oops! Something went wrong.");
      });
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.contactForm}>
          <h2>Contact Us</h2>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          <textarea
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
          ></textarea>
          <button onClick={handleSubmit}>Submit</button>
          {status && <p>{status}</p>}  
        </div>
      </div>

    </Layout>
  );
};

export default ContactUs;
