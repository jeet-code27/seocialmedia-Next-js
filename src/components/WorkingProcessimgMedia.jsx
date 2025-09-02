'use client';

import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
const services = [
  
  {
    title: "Dynamic Website Design",
    description:
      "In Ajmer, where businesses are growing rapidly, a dynamic website is essential to keep up with the market. Our team specializes in crafting interactive websites that adapt to user behavior, integrate real-time features, and streamline user navigation. Whether you run a local hotel, school, or store, our dynamic websites ensure scalability, speed, and seamless content management.",
    image: "/images/dynamic-website.webp",
  },
  {
    title: "Static Website Design",
    description:
      "Ideal for small businesses, professionals, and startups in Ajmer, our static website designs are clean, fast, and cost-effective. We focus on giving your brand a professional online identity that doesn’t require frequent updates. From educational institutes to local artisans, our static websites are tailored to build trust and credibility within the Ajmer community.",
    image: "/images/static-website.webp",
  },
  {
    title: "Responsive Web Design",
    description:
      "Ajmer’s digital landscape is evolving, and your website must be accessible across all devices. We ensure your website adjusts flawlessly to mobile phones, tablets, and desktops. With a focus on user-friendly interfaces and fast loading times, our responsive designs help you capture traffic from Ajmer’s tech-savvy audience and keep them engaged longer.",
    image: "/images/responsive-design.webp",
  },
  {
    title: "CMS Web Design",
    description:
      "Managing website content shouldn't be a challenge. Our CMS web design solutions in Ajmer empower you to update your site effortlessly. We work with platforms like WordPress, Joomla, and more to deliver interfaces that are easy to handle, even for non-tech users. Ideal for schools, NGOs, or event organizers in Ajmer looking for frequent content updates.",
    image: "/images/cms-design.webp",
  },
  {
    title: "Corporate Website Design",
    description:
      "We understand the unique branding needs of corporate entities in Ajmer. Whether you're a local manufacturer or a real estate firm, our corporate websites are designed to reflect your professionalism, expertise, and reliability. With modern layouts, strong CTAs, and company-centric visuals, we help your business establish a trustworthy online reputation.",
    image: "/images/corporate-website.webp",
  },
  {
    title: "Blog Website Design",
    description:
      "Ajmer has a vibrant mix of travel bloggers, spiritual influencers, and food reviewers. Our blog website designs are optimized for readability, SEO, and audience engagement. We ensure your blog stands out with a visually pleasing layout, responsive design, and easy categorization of posts, making it perfect for individuals and organizations with stories to share.",
    image: "/images/blog-design.webp",
  },
  {
    title: "Ecommerce Website Design",
    description:
      "Whether you're selling local Rajasthani handicrafts or running a wholesale business in Ajmer, our eCommerce website designs are built to convert. We focus on intuitive navigation, minimalistic UI, secure payment gateways, and mobile optimization to ensure your online store provides a smooth and trustworthy shopping experience for your customers.",
    image: "/images/ecommerce.webp",
  },
   
  
  {
    title: "Web Portal Design",
    description:
      "From tourism and education to government services and local businesses, Ajmer needs smart portals to centralize information. Our web portal designs focus on user segmentation, secure login areas, and organized data structures. Whether you're building a university portal or a local trade directory, we make it simple, interactive, and scalable.",
    image: "/images/web-portal.webp",
  },
];

const WorkingProcessimgMedia = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
    <center>
    <h2 className="z-10 mb-2 lg:ml-3 text-white mt-10  font-bold w-fit text-3xl py-1 px-4 rounded-3xl bg-blue-900">
    Our Web Services in Ajmer
  </h2>
  </center>
    <section className="max-w-7xl mx-auto mb-10 rounded-[60px] overflow-hidden flex flex-col lg:flex-row shadow-md">
      {/* Sidebar */}
     
      <div className="bg-[#0A0D2B] text-white w-full lg:w-1/3 p-6 flex flex-col gap-4">
        {services.map((service, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-4 py-3 rounded-full cursor-pointer transition ${
              activeIndex === index ? 'bg-purple-600' : ''
            }`}
            onClick={() => setActiveIndex(index)}
          >
            <span className="text-left text-sm md:text-base">{service.title}</span>
            {activeIndex === index && (
              <div className="bg-black rounded-full p-2">
                <FaArrowRight className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gradient-to-r from-blue-500 to-transparent bg-gray-50 w-full lg:w-2/3 p-6 md:p-10 flex flex-col lg:flex-col gap-8 rounded-br-[60px]">

      
        <div className="flex-1 order-2">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
            {services[activeIndex].title}
          </h3>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            {services[activeIndex].description}
          </p>
        </div>

        {/* Image */}
        <div className="flex order-1 max-w-[500px] items-center justify-center bg-white rounded-3xl p-0 md:p-8 shadow w-full h-[43%]">
          <Image
            src={services[activeIndex].image}
            alt={services[activeIndex].title}
            className="rounded-xl w-full h-auto object-cover"
            width={500}
            height={300}
          />
        </div>
      </div>
    </section>
    </>
  );
};

export default WorkingProcessimgMedia;
