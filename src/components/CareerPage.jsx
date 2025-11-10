"use client";

import { useRef, useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";

const CareerPage = () => {
  const positions = [
    {
      title: "SEO Expert",
      type: "Full-time",
      location: "1, Sagar, Shiv Shakti Nagar, Nirman Nagar, Jaipur",
      experience: "1+ years",
      description:
        "Improve website rankings through effective SEO strategies and best practices.",
    },
    {
      title: "Google Ads Expert",
      type: "Full-time",
      location: "1, Sagar, Shiv Shakti Nagar, Nirman Nagar, Jaipur",
      experience: "1+ years",
      description: "Optimize and manage Google Ads campaigns for maximum ROI.",
    },
    {
      title: "Website Developer",
      type: "Full-time",
      location: "1, Sagar, Shiv Shakti Nagar, Nirman Nagar, Jaipur",
      experience: "1+ years",
      description:
        "Build responsive and high-performing websites for diverse clients.",
    },
    {
      title: "Social Media Manager",
      type: "Full-time",
      location: "1, Sagar, Shiv Shakti Nagar, Nirman Nagar, Jaipur",
      experience: "1+ years",
      description:
        "Create and execute social media strategies to grow engagement.",
    },
    {
      title: "Graphic Designer",
      type: "Full-time",
      location: "1, Sagar, Shiv Shakti Nagar, Nirman Nagar, Jaipur",
      experience: "1+ years",
      description: "Design stunning graphics and visual assets for campaigns.",
    },
    {
      title: "Video Editor",
      type: "Full-time",
      location: "1, Sagar, Shiv Shakti Nagar, Nirman Nagar, Jaipur",
      experience: "1+ years",
      description:
        "Edit and produce high-quality videos for marketing and branding.",
    },
    {
      title: "Content Writer",
      type: "Full-time",
      location: "1, Sagar, Shiv Shakti Nagar, Nirman Nagar, Jaipur",
      experience: "1+ years",
      description:
        "Write engaging and SEO-friendly content for diverse industries.",
    },
  ];

  const [showForm, setShowForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    setErrors({});

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    let valid = true;
    const newErrors = {};

    if (!name) {
      newErrors.name = "Please enter your name.";
      valid = false;
    }
    if (!email) {
      newErrors.email = "Please enter your email.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }
    if (!phone) {
      newErrors.phone = "Please enter your phone number.";
      valid = false;
    } else if (!/^\d{10,}$/.test(phone)) {
      newErrors.phone = "Phone number must be at least 10 digits.";
      valid = false;
    }
    if (!subject) {
      newErrors.subject = "Please enter a subject.";
      valid = false;
    }
    if (!message) {
      newErrors.message = "Please enter a message.";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    // Simulated email send
    console.log("Form submitted:", { name, email, phone, subject, message });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setShowForm(false);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const ContactUs = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
          >
            ✕
          </button>
          <h1 className="text-2xl font-bold text-center mb-4">Contact Us</h1>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength={15}
                onKeyPress={handlePhoneKeyPress}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-md p-2 hover:scale-105 transition-transform duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen flex items-center justify-center">
        <div className="px-4 py-16 md:px-16 lg:px-24 w-full">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex gap-2 flex-col w-full justify-center items-center">
              <span className="inline-block px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-full font-medium">
                Join Our Team
              </span>
              <h1 className="mt-6 pb-4 text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent md:text-6xl">
                Career Opportunities
              </h1>
              <p className="mt-6 text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
                Join our innovative team and help shape the future of digital
                marketing. We offer competitive benefits and a dynamic work
                environment.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((position, index) => (
                <div
                  key={index}
                  className="relative p-6 bg-white rounded-xl shadow-lg hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-5 rounded-xl" />
                  <div className="relative space-y-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl w-fit">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl text-left font-semibold text-gray-800">
                      {position.title}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{position.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>
                          <MapPin className="w-4 h-4" />
                        </span>
                        <span className="text-left">{position.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{position.experience}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-left">
                      {position.description}
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2"
                    >
                      Apply Now <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showForm && <ContactUs onClose={() => setShowForm(false)} />}
      {formSuccess && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          Thank you for contacting us. We will get back to you shortly.
        </div>
      )}
    </>
  );
};

export default CareerPage;