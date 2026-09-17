"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket, LogOut, User, LayoutDashboard, Github, Linkedin } from "lucide-react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavbarProps, NavItem } from "@/types/nav";
import MaxWidthWrapper from "../common/MaxWidthWrapper";
import { getPersonalInfo, PersonalInfo } from "@/lib/personal-info";

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "My Library", href: "/dashboard" },
  { name: "Run Lecture", href: "/upload" },
  { name: "Features", href: "/#features" },
  { name: "About Us", href: "/#about" },
];

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const mobileNavVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const controls = useAnimation();
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ fullName?: string; email?: string } | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(getPersonalInfo());

  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);

    const updateInfo = () => setPersonalInfo(getPersonalInfo());
    window.addEventListener("personal_info_updated", updateInfo);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("personal_info_updated", updateInfo);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setCurrentUser(null);
    window.location.href = "/";
  };

  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      setScrolled(window.scrollY > 50);
    });
  }, []);

  useEffect(() => {
    controls.start("visible");
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, handleScroll]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const NavLink = useCallback(
    ({ item }: { item: NavItem }) => (
      <Link
        href={item.href}
        className={cn(
          "relative px-3 py-2 text-sm font-medium group transition-all duration-300",
          pathname === item.href
            ? "text-cyan-300"
            : "text-gray-300 hover:text-white"
        )}
      >
        {item.name}
        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
      </Link>
    ),
    [pathname]
  );

  const MobileNavLink = useCallback(
    ({ item }: { item: NavItem }) => (
      <Link
        href={item.href}
        className={cn(
          "block px-4 py-3 rounded-lg text-base font-medium transition-all",
          pathname === item.href
            ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300"
            : "text-gray-300 hover:bg-white/5"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        {item.name}
      </Link>
    ),
    [pathname]
  );

  const AuthButton = () => {
    return (
      <div className="flex items-center gap-2 sm:gap-2.5">
        <a
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
          title={`Visit ${personalInfo.name}'s LinkedIn profile`}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-[10px] font-bold text-white flex items-center justify-center uppercase shrink-0">
            {personalInfo.name ? personalInfo.name[0] : "S"}
          </div>
          <span className="hidden sm:inline font-semibold">{personalInfo.name}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">
            Profile
          </span>
        </a>

        {currentUser ? (
          <>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="group relative bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 backdrop-blur-lg border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
              >
                <LayoutDashboard className="mr-2 h-4 w-4 text-cyan-300" />
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 hover:bg-white/5 border border-white/10"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/5"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="ghost"
                className="group relative bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 backdrop-blur-lg border border-white/10 hover:border-cyan-400/30 hover:from-cyan-500/30 hover:to-emerald-500/30 transition-all duration-300"
                aria-label="Get started"
              >
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  Get Started
                </span>
                <Rocket className="ml-2 h-4 w-4 text-emerald-300 group-hover:animate-pulse" />
              </Button>
            </Link>
          </>
        )}
      </div>
    );
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={cn(
        "sticky top-0 z-50 bg-black/80 backdrop-blur-xl transition-all duration-300",
        scrolled ? "border-b border-white/10" : "border-transparent",
        className
      )}
    >
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center group">
              <motion.div
                whileHover={{ rotate: [0, -15, 15, 0] }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
              </motion.div>
              <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300 bg-clip-text text-transparent font-bold text-2xl">
                NexusEDU
              </span>
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <NavLink item={item} />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden md:block"
          >
            <AuthButton />
          </motion.div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-cyan-300" />
              ) : (
                <Menu className="h-6 w-6 text-cyan-300" />
              )}
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileNavVariants}
            className="md:hidden bg-black/80 backdrop-blur-2xl"
          >
            <div className="px-4 pt-2 pb-8 space-y-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MobileNavLink item={item} />
                </motion.div>
              ))}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-4 pt-4"
              >
                <AuthButton />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

