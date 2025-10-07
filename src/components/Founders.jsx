import React from "react";
import { Linkedin, Mail } from "lucide-react";

export const Founders = () => {
  const founders = [
    {
      name: "Mudit Mathur",
      role: "Co-Founder & CEO",
      image: "/images/founders/muditmathur.jpg",
      bio: "A dynamic entrepreneur with over 12 years of cross-industry expertise spanning Banking, Pharmaceuticals, Hospitality, and Digital Marketing. Mudit brings a unique blend of strategic thinking and hands-on execution to drive measurable results for our healthcare clients.",
      education: [
        "MSc Digital Marketing & Channel Management - University of Surrey, UK",
        "MBA Marketing - Alliance University, Bangalore",
        "B.Sc. Hospitality & Hotel Administration - IHM Ahmedabad",
      ],
      linkedin: "https://www.linkedin.com/in/mudit-mathur-6b738327/",
      email: "mudit@company.com",
    },
    {
      name: "Kushagra Parashar",
      role: "Co-Founder & CEO",
      image: "/images/founders/kushagra-parasher.jpg",
      bio: "A tech visionary with a passion for innovation, Kushagra is dedicated to leveraging technology to create impactful solutions for our clients.",
      education: [
        "Diploma in B.Sc(IT) from NIIT (Software Engineer)",
        "MBA from Symbiosis",
      ],
      linkedin: "https://www.linkedin.com/in/kushagra-parashar-6550b7385/",
      email: "cofounder@company.com",
    },
  ];

  return (
    <section className="py-20 px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Founders
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The visionaries behind our success, bringing decades of combined
            expertise
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {founders.map((founder, index) => (
            <div
              key={index}
              className=" rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-80 w-full lg:w-[80%]  lg:h-100">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="w-full h-full object-fit lg:rounded-full"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Name & Role */}
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {founder.name}
                  </h3>
                  <p className="text-lg text-blue-600 font-semibold">
                    {founder.role}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  {founder.bio}
                </p>

                {/* Education */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Education
                  </h4>
                  <ul className="space-y-2">
                    {founder.education.map((edu, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 pl-4 border-l-2 border-blue-500"
                      >
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Linkedin size={20} />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                  <a
                    href={`mailto:${founder.email}`}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Mail size={20} />
                    <span className="text-sm font-medium">Email</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
