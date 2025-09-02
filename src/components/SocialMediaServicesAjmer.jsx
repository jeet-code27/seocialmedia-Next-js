'use client';

import React, { useState } from 'react';
 
import { 
  Share2, 
  BarChart2, 
  Users, 
  Camera, 
  MessageCircle, 
  TrendingUp,
  Target,
  CheckCircle,
  Award,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import ServicesSectionAjmer from './ServicesSectionAjmer';
import SocialMediaHeroAjmer from './SocialMediaHeroAjmer';

const SocialMediaServicesAjmer = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const stats = [
    {
      number: "250K+",
      label: "Social Impressions",
      icon: <Globe className="w-6 h-6" />
    },
    {
      number: "1000+",
      label: "Clients Served",
      icon: <Award className="w-6 h-6" />
    },
    {
      number: "95%",
      label: "Client Satisfaction",
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      number: "300%",
      label: "Average ROI",
      icon: <Zap className="w-6 h-6" />
    }
  ];
  
  const features = [
    { 
      name: "Social Strategy", 
      category: "Planning",
      description: "Data-driven social media strategies tailored to your business goals",
      icon: <Target className="w-6 h-6 text-white" />,
      gradient: "from-pink-500 to-rose-500"
    },
    { 
      name: "Content Creation", 
      category: "Production",
      description: "Engaging visual and written content that resonates with your audience",
      icon: <Camera className="w-6 h-6 text-white" />,
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      name: "Community Management", 
      category: "Engagement",
      description: "Active community engagement and reputation management",
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-indigo-500"
    },
    { 
      name: "Performance Analytics", 
      category: "Reporting",
      description: "Comprehensive analytics and ROI tracking for campaigns",
      icon: <BarChart2 className="w-6 h-6 text-white" />,
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      name: "Influencer Marketing", 
      category: "Partnerships",
      description: "Strategic influencer partnerships that amplify your reach",
      icon: <Users className="w-6 h-6 text-white" />,
      gradient: "from-yellow-500 to-orange-500"
    },
    { 
      name: "Growth Strategy", 
      category: "Optimization",
      description: "Scalable growth tactics for sustainable social media success",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      gradient: "from-red-500 to-pink-500"
    },
    { 
      name: "Brand Building", 
      category: "Identity",
      description: "Consistent brand messaging across all social platforms",
      icon: <Share2 className="w-6 h-6 text-white" />,
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  const faqs = [
    {
      question: "Why is SEOcial Media Solutions considered the best social media company in Ajmer?",
      answer:
        "SEOcial Media Solutions stands out as the premier social media company in Ajmer due to our proven track record of delivering exceptional results for over 1000+ clients. We combine data-driven strategies with creative excellence, offering comprehensive services from content creation to performance analytics. Our team of certified social media experts understands the local Ajmer market dynamics while implementing global best practices. We've consistently achieved a 95% client satisfaction rate and 300% average ROI for our clients through our innovative approach to social media marketing."
    },
    {
      question: "How does your company help generate quality leads through social media?",
      answer:
        "We generate quality leads through a multi-faceted approach that includes targeted advertising campaigns, compelling content marketing, and strategic audience engagement. Our process involves creating detailed buyer personas, developing lead magnets, implementing conversion-optimized landing pages, and using advanced targeting features across platforms like Facebook, Instagram, and LinkedIn. We also utilize retargeting campaigns, influencer partnerships, and community building strategies to nurture prospects through the sales funnel, ensuring higher conversion rates and better lead quality."
    },
    {
      question: "Can SEOcial Media Solutions help increase followers organically on Instagram and Facebook?",
      answer:
        "Absolutely! Our organic growth strategies focus on creating authentic engagement and building genuine community connections. We develop compelling content calendars, use strategic hashtag research, optimize posting times based on audience analytics, and engage meaningfully with your target audience. Our approach includes collaborating with micro-influencers, creating shareable content, running engagement campaigns, and leveraging user-generated content. We typically see 40-60% organic follower growth within the first 3 months while maintaining high engagement rates."
    },
    {
      question: "Do you offer custom social media marketing packages for small businesses in Ajmer?",
      answer:
        "Yes, we understand that small businesses have unique needs and budget constraints. We offer flexible, customized social media packages specifically designed for small businesses in Ajmer. Our packages can be tailored to include specific platforms, content types, posting frequency, and advertising budgets that align with your business goals. We also provide scalable solutions that can grow with your business, ensuring you get maximum value from your investment while building a strong social media presence."
    },
    {
      question: "Can you help boost brand awareness and online popularity for my business?",
      answer:
        "Brand awareness and online popularity are core focuses of our social media strategies. We achieve this through consistent brand messaging, viral content creation, strategic hashtag campaigns, influencer collaborations, and community engagement initiatives. Our comprehensive approach includes reputation management, crisis communication, thought leadership content, and strategic partnerships. We track brand mention sentiment, reach metrics, and engagement quality to ensure your brand gains positive recognition and builds a loyal online community."
    },
    {
      question: "Which social media platforms do you manage and promote for clients?",
      answer:
        "We provide comprehensive management and promotion services across all major social media platforms including Instagram, Facebook, Twitter, LinkedIn, YouTube, Pinterest, TikTok, and Google My Business. Our platform selection is based on your target audience demographics, business objectives, and industry requirements. We also stay updated with emerging platforms and can develop strategies for newer social networks as they gain relevance to your business goals. Each platform strategy is tailored to leverage its unique features and audience behavior patterns."
    }
  ];

  return (
    <div className="min-h-screen">
 
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <h1 className="inline-block px-4 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm rounded-full font-medium">
          Best Social Media Marketing Company in Ajmer
        </h1>
        <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent md:text-6xl">
          Transform Your Social Media Presence
        </h2>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-600">
          Drive engagement, build meaningful connections, and achieve measurable results with our comprehensive social media marketing solutions.
        </p>
      </section>

      <SocialMediaHeroAjmer/>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white">
                  {stat.icon}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <h2 className="text-3xl font-bold text-center mt-8">
        Key Features
      </h2>
      {/* Features Grid */}
      <div className="my-24 max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="relative p-6 group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative flex flex-col space-y-4">
              <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-xl w-fit`}>
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {feature.name}
                </h3>
                <p className="text-sm text-pink-600 font-medium">
                  {feature.category}
                </p>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ServicesSectionAjmer/>

      {/* FAQ Section */}
      <section className="py-16 bg-white rounded-3xl shadow-lg">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Get answers to common questions about our social media services</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden hover:border-pink-300 transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center bg-gradient-to-r from-gray-50 to-pink-50 hover:from-pink-50 hover:to-purple-50 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-pink-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-pink-600" />
                    )}
                  </div>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-5 bg-white border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Still have questions? We're here to help!
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <div className="py-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl px-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Our Social Media Services?</h2>
          <div className="text-left space-y-6">
            <p className="text-gray-700">
              At SEOcial Media Solutions, we blend creativity with strategy to deliver impactful social media marketing. Our team of specialists brings together industry insights, platform expertise, and data-backed techniques to elevate your brand’s digital presence.
            </p>
            <p className="text-gray-700">
              We go beyond basic posting — offering a full spectrum of services including content creation, audience engagement, campaign management, and targeted ad strategies. Every solution is tailored to reflect your unique brand voice and aligned with your business goals.
            </p>
            <p className="text-gray-700">
              Trusted by 1000+ businesses, our results-driven approach helps you build a loyal audience, boost engagement, and drive measurable growth. Partner with us to stay ahead of trends and turn your social media into a powerful marketing channel.
            </p>
          </div>
        </div>
      </div>


      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="relative max-w-3xl mx-auto p-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-10" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Ready to Elevate Your Social Media Strategy?
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              Let's create engaging social content that drives results for your brand
            </p>
            <div className="mt-8 space-x-4">
              <button
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-8 rounded-lg hover:opacity-90 transition-opacity duration-300"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaServicesAjmer;