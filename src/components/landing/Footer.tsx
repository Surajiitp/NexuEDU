"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, User } from "lucide-react";
import MaxWidthWrapper from "../common/MaxWidthWrapper";
import { motion } from "framer-motion";
import { getPersonalInfo, PersonalInfo } from "@/lib/personal-info";

const Footer = () => {
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

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <footer className="pb-6 relative overflow-hidden">
        <MaxWidthWrapper>
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} NexusEDU. All rights reserved.
              </p>
              <span className="hidden sm:inline text-gray-700">•</span>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-white/5"
                title={`Visit ${personalInfo.name}'s LinkedIn profile`}
              >
                <User className="w-3 h-3" />
                <span>Created by {personalInfo.name}</span>
              </a>
            </div>

            <div className="flex items-center gap-3">
              {/* GitHub */}
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 transition-colors cursor-pointer border border-white/5 hover:border-cyan-500/30"
                aria-label="GitHub"
                title={`GitHub: ${personalInfo.github}`}
              >
                <Github className="h-4 w-4" />
              </a>

              {/* LinkedIn */}
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-blue-500/20 text-gray-300 hover:text-blue-300 transition-colors cursor-pointer border border-white/5 hover:border-blue-500/30"
                aria-label="LinkedIn"
                title={`LinkedIn: ${personalInfo.linkedin}`}
              >
                <Linkedin className="h-4 w-4" />
              </a>

              {/* Email */}
              <a
                href={`mailto:${personalInfo.email}`}
                className="p-2 rounded-full bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 transition-colors cursor-pointer border border-white/5 hover:border-emerald-500/30"
                aria-label="Email"
                title={`Email: ${personalInfo.email}`}
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </MaxWidthWrapper>
      </footer>
    </>
  );
};

export default Footer;

