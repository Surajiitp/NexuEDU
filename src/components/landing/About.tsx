"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Shield, Zap, Users, ChevronDown, Sparkles, Github, Linkedin, Mail } from "lucide-react";
import MaxWidthWrapper from "../common/MaxWidthWrapper";
import { getPersonalInfo, PersonalInfo } from "@/lib/personal-info";
import Tilt3DCard from "../common/tilt-3d-card";

const AboutSection: React.FC = () => {
  const [expandedPoint, setExpandedPoint] = useState<number | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(getPersonalInfo());

  useEffect(() => {
    const update = () => setPersonalInfo(getPersonalInfo());
    window.addEventListener("personal_info_updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("personal_info_updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const points = [
    {
      icon: Cloud,
      title: "Easy Upload",
      description:
        "Simply paste any educational video link and let our AI do the work.",
      details:
        "Whether it's a university lecture, online course, or educational content from platforms like YouTube, our system processes videos instantly. Just share the link, and we'll transform it into comprehensive study materials within minutes.",
    },
    {
      icon: Shield,
      title: "Smart Summary",
      description:
        "AI-powered technology that captures key concepts and important details.",
      details:
        "Our advanced AI analyzes the video content, identifies crucial information, and creates well-structured notes. The summaries include main topics, key points, definitions, and examples, making it perfect for quick revision and deep understanding.",
    },
    {
      icon: Zap,
      title: "Practice Ready",
      description:
        "Automatically generated MCQs to test your understanding.",
      details:
        "Turn passive watching into active learning with our AI-generated multiple-choice questions. Each set of questions is carefully crafted to test your comprehension of the video content, helping you prepare for exams and assessments effectively.",
    },
    {
      icon: Users,
      title: "Learning Community",
      description: "Join a community of students and educators enhancing their learning experience.",
      details:
        "Connect with fellow learners, share valuable educational content, and collaborate on study materials. Our platform makes it easier to learn together and maximize the benefits of online educational content.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-12 md:py-20" id="about">
      <MaxWidthWrapper className="">
        <div className="container relative px-4 sm:px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeIn}
            className="mx-auto max-w-4xl text-center mb-12 md:mb-16 relative"
          >
            <div className="absolute -top-4 md:-top-8 left-1/2 -translate-x-1/2">
              <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-green-400 bg-clip-text text-transparent drop-shadow">
                About NexusEDU
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mt-4 md:mt-6 font-medium">
              We&apos;re transforming video lectures into{" "}
              <span className="bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                smart notes
              </span>
              ,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                practice questions
              </span>
              , and{" "}
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                learning tools
              </span>
              .
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 text-white mb-12 md:mb-16">
            {points.map((point, index) => (
              <motion.div
                key={point.title}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10"
                whileHover={{ scale: 1.01 }}
              >
                <div className="relative">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="relative mr-3 md:mr-4">
                      <point.icon className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                      {point.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-3 md:mb-4 font-medium text-sm md:text-base truncate">
                    {point.description}
                  </p>
                  <motion.button
                    className="text-blue-400 flex items-center group/button text-sm md:text-base"
                    onClick={() =>
                      setExpandedPoint(expandedPoint === index ? null : index)
                    }
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-blue-400/0 h-px w-8 mr-2 transition-all group-hover/button:w-12" />
                    Learn More
                    <ChevronDown
                      className={`ml-2 transform transition-transform duration-200 ${expandedPoint === index
                        ? "rotate-180 text-teal-400"
                        : ""
                        }`}
                    />
                  </motion.button>
                  <AnimatePresence>
                    {expandedPoint === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 text-gray-400 font-medium text-sm md:text-base"
                      >
                        {point.details}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.4 }}
            className="relative bg-gradient-to-br from-blue-500/15 to-teal-500/15 rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/10"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
              Our Technology
            </h3>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed font-medium">
              Powered by advanced AI, NexusEDU transforms educational videos into comprehensive study materials. With{" "}
              <span className="text-teal-400">smart summarization</span>,{" "}
              <span className="text-blue-400">intelligent question generation</span>,
              and{" "}
              <span className="text-green-400">
                structured learning content
              </span>
              , we&apos;re making online education more effective and engaging.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {[
                "98% Accuracy",
                "5min Processing",
                "24/7 Learning"
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white/5 rounded-lg p-3 md:p-4 text-center"
                >
                  <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    {item.split(" ")[0]}
                  </div>
                  <div className="text-gray-400 text-xs md:text-sm mt-1">
                    {item.split(" ").slice(1).join(" ")}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Developer / Personal Information Showcase */}
          <Tilt3DCard className="w-full mt-12 md:mt-16" intensity={8} glare={true}>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.5 }}
              className="w-full relative bg-gradient-to-br from-gray-900/90 via-gray-950/90 to-gray-900/90 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-800 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-400 to-emerald-500 p-1 shrink-0 shadow-xl shadow-cyan-500/20">
                    <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider">
                      {personalInfo.name ? personalInfo.name.split(" ").map(n => n[0]).join("").slice(0, 2) : "SK"}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {personalInfo.name}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        Creator & Developer
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 font-medium">
                      {personalInfo.role}
                    </p>
                    <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
                      {personalInfo.bio}
                    </p>
                    {/* Skills badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {personalInfo.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300 text-[11px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Link Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>Connect on LinkedIn</span>
                  </a>

                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>Explore GitHub Profile</span>
                  </a>

                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Get in Touch</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </Tilt3DCard>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};


export default AboutSection;
