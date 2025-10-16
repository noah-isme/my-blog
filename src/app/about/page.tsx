"use client";

import { motion } from "framer-motion";
import { Users, Target, Heart, Award, Mail } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community First",
      description: "We believe in building a supportive community where ideas flourish and connections are made."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Quality Content",
      description: "Every article is carefully crafted to provide value, insights, and inspiration to our readers."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion Driven",
      description: "We're passionate about sharing knowledge and creating meaningful conversations."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from writing to user experience."
    }
  ];

  const team = [
    {
      name: "Admin User",
      role: "Founder & Editor",
      bio: "Passionate about technology, writing, and building amazing digital experiences.",
      image: "/api/placeholder/150/150"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">About My Blog</h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto">
              We&apos;re on a mission to share knowledge, inspire creativity, and build a community of lifelong learners.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To create a platform where ideas come to life, knowledge is shared freely, and every voice matters.
              We believe that great content can change lives and bring people together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Do</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  My Blog is a modern platform dedicated to sharing insights, stories, and knowledge across various topics.
                  From technology and lifestyle to personal development and creative pursuits, we cover it all.
                </p>
                <p>
                  Our team of passionate writers and contributors work tirelessly to bring you content that informs,
                  entertains, and inspires. We believe in the power of words to create change and foster understanding.
                </p>
                <p>
                  Join our growing community of readers who come back for thought-provoking articles,
                  practical advice, and meaningful discussions.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-6">
                  <Target className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h4>
                <p className="text-gray-600">
                  To become the go-to destination for quality content that matters,
                  where readers discover new perspectives and writers find their voice.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do and shape the culture of our community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind My Blog who make it all happen.
            </p>
          </motion.div>

          <div className="flex justify-center">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="text-center max-w-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl mb-8 text-blue-100">
              Have questions, suggestions, or want to contribute? We&apos;d love to hear from you.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Us
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}