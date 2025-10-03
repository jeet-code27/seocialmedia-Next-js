import { useState } from "react";
import {
  Linkedin,
  Twitter,
  Mail,
  Award,
  Users,
  TrendingUp,
  Lightbulb,
  Quote,
} from "lucide-react";

export const Founders = () => {
  const [activeTab, setActiveTab] = useState("story");

  const achievements = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "Direct",
      label: "Founder Access",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "Real",
      label: "Results Focus",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      value: "Fast",
      label: "Agile Solutions",
    },
    {
      icon: <Award className="w-6 h-6" />,
      value: "100%",
      label: "Invested in You",
    },
  ];

  const milestones = [
    {
      year: "Early Days",
      title: "The Frustration",
      description:
        "Mudit and Kushagra watched talented business owners struggle with confusing marketing jargon and wasted ad spend.",
    },
    {
      year: "The Pivot",
      title: "Born from Our Desks",
      description:
        "Started the agency from our workspaces, fueled by coffee and the belief that marketing should be accessible.",
    },
    {
      year: "First Wins",
      title: "Brave Clients, Real Results",
      description:
        "Took on initial clients who believed in the vision. Delivered real traffic, leads, and sales—not just vanity metrics.",
    },
    {
      year: "Building Trust",
      title: "Word of Mouth Growth",
      description:
        "Clients became advocates. Our reputation grew from results, not flashy promises.",
    },
    {
      year: "Today",
      title: "Your Growth Partners",
      description:
        "Bringing that same founder-led energy, transparency, and results-driven approach to every new partnership.",
    },
  ];

  const expertise = [
    "SEO That Actually Works",
    "Social Media Growth",
    "Google Presence Optimization",
    "Content That Converts",
    "Web Development",
    "Results-Driven Strategy",
  ];

  return (
    <div className="min-h-screen   text-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden text-black  rounded-b-3xl shadow-lg mb-16">
        <div className="absolute inset-0 "></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2bg-opacity-20 rounded-full text-sm font-semibold backdrop-blur-sm">
                Co-Founders & CEOs
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Hey there, We're Mudit & Kushagra
              </h1>
              <p className="text-xl  leading-relaxed">
                Building a different kind of digital marketing agency—one where
                effective marketing is accessible, transparent, and
                results-driven for businesses like yours.
              </p>
              <div className="flex gap-4 pt-4">
                <button className="p-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition">
                  <Linkedin className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 p-1">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <Users className="w-32 h-32 text-black opacity-50" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-pink-400 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                {achievement.icon}
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-1">
                {achievement.value}
              </div>
              <div className="text-sm text-slate-600">{achievement.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {["story", "journey", "expertise"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? "bg-blue-600  text-black shadow-lg"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Story Tab */}
        {activeTab === "story" && (
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div className="flex items-start gap-4">
                <Quote className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-4">
                    Meet the Co-Founders
                  </h2>

                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Mudit Mathur
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Co-Founder driving strategy and client success. Passionate
                      about transforming complex marketing into simple,
                      actionable plans that deliver real results.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Kushagra Parashar
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      Co-Founder focused on innovation and execution. Committed
                      to building transparent, results-driven solutions that
                      empower businesses to thrive online.
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-3">
                      Our Story
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      For years, we watched brilliant founders, artisans, and
                      small business owners pour their hearts into their work,
                      only to get lost in the digital shuffle. They were told
                      they needed to "be on social media" or "do SEO," but no
                      one showed them how in a way that actually worked for
                      their budget and their reality.
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      We saw the confusion firsthand. The complex dashboards,
                      the empty promises of "viral fame," the money spent on ads
                      with no real return. It was frustrating.
                    </p>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      So, we decided to build a different kind of solution. This
                      agency was born not in a fancy office, but from our own
                      desks—fueled by late nights, countless cups of coffee, and
                      a stubborn belief that effective marketing should be
                      accessible, transparent, and results-driven.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      We started by taking on a few brave clients. We became a
                      team. We focused on what truly moves the needle: clear
                      goals, honest communication, and strategies built for
                      growth, not just for likes. The results were real—more
                      website traffic, qualified leads, and most importantly,
                      increased sales.
                    </p>
                    <p className="text-slate-700 leading-relaxed font-semibold mt-6">
                      That's the same energy and focus we're bringing to you.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Why Partner with a Startup? You Get the "A-Team"
                </h3>
                <p className="text-blue-50 leading-relaxed mb-6">
                  When you work with us, you're not getting a junior account
                  manager. You're getting both founders, Mudit and Kushagra,
                  directly involved in your strategy.
                </p>
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-lg mb-1">
                          Direct Access
                        </div>
                        <div className="text-blue-50">
                          Our brains, our passion, and our direct line. No
                          bureaucracy, no runaround.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-lg mb-1">Agility</div>
                        <div className="text-blue-50">
                          We're fast. We can test, pivot, and adapt strategies
                          in real-time without layers of approval.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-bold text-lg mb-1">
                          Unmatched Passion
                        </div>
                        <div className="text-blue-50">
                          Your win is our win. Our reputation is on the line
                          with every campaign we run. We are personally invested
                          in your success.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Our Core Beliefs
                </h3>
                <p className="text-slate-600 mb-4 font-semibold">
                  The Startup Manifesto
                </p>
                <div className="space-y-3 text-slate-600">
                  <div className="border-l-4 border-blue-600 pl-4">
                    <div className="font-semibold text-slate-800">
                      Accessible Marketing
                    </div>
                    <div className="text-sm">
                      Effective strategies shouldn't require a Fortune 500
                      budget
                    </div>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <div className="font-semibold text-slate-800">
                      Radical Transparency
                    </div>
                    <div className="text-sm">
                      Clear communication, honest metrics, no hidden fees
                    </div>
                  </div>
                  <div className="border-l-4 border-blue-600 pl-4">
                    <div className="font-semibold text-slate-800">
                      Results Over Vanity
                    </div>
                    <div className="text-sm">
                      We measure success by sales and growth, not just likes
                    </div>
                  </div>
                  <div className="border-l-4 border-purple-600 pl-4">
                    <div className="font-semibold text-slate-800">
                      Partnership Mindset
                    </div>
                    <div className="text-sm">
                      Your success is our success—we're in this together
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Journey Tab */}
        {activeTab === "journey" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              The Journey
            </h2>
            <div className="relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`flex items-center gap-8 ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`flex-1 ${
                          index % 2 === 0 ? "md:text-right" : "md:text-left"
                        }`}
                      >
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 hover:shadow-lg transition">
                          <div className="text-blue-600 font-bold text-2xl mb-2">
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {milestone.title}
                          </h3>
                          <p className="text-slate-600">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                      <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2"></div>
                      <div className="flex-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expertise Tab */}
        {activeTab === "expertise" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Core Expertise
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {expertise.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 text-center hover:shadow-md transition"
                  >
                    <div className="font-semibold text-slate-800">{skill}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Speaking & Thought Leadership
                </h3>
                <p className="text-slate-600 mb-4">
                  Regular speaker at major marketing conferences and contributor
                  to leading industry publications.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    TEDx Speaker
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Forbes Contributor
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Podcast Host
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">The Founders</h3>
                <div className="space-y-6">
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="font-semibold text-lg mb-2">
                      Mudit Mathur
                    </div>
                    <div className="text-slate-300 text-sm">
                      Co-Founder & CEO
                    </div>
                    <div className="text-slate-300 mt-2">
                      Strategic thinker focused on client growth and
                      results-driven marketing solutions.
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="font-semibold text-lg mb-2">
                      Kushagra Parashar
                    </div>
                    <div className="text-slate-300 text-sm">
                      Co-Founder & CEO
                    </div>
                    <div className="text-slate-300 mt-2">
                      Innovation driver committed to transparent, accessible
                      digital marketing.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Let's Connect
                </h3>
                <p className="text-slate-600 mb-6">
                  Interested in collaborating or learning more about our
                  approach to digital marketing? I'd love to hear from you.
                </p>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                  Schedule a Consultation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
