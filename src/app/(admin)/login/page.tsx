"use client";

import LoginForm from "@/components/LoginForm";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-accent/20" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-accent/10 rounded-full blur-xl"
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-40 h-40 bg-accent/5 rounded-full blur-xl"
            animate={{
              x: [0, -25, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="text-2xl font-playfair font-bold">My Blog</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-playfair font-bold leading-tight">
                Welcome Back to
                <span className="block text-accent">Your Creative Space</span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Manage your content, engage with your audience, and grow your blog
                with powerful admin tools.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              {[
                {
                  icon: BookOpen,
                  label: "Content Management",
                  desc: "Create & edit posts",
                },
                { icon: Sparkles, label: "Analytics", desc: "Track performance" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.label}</h3>
                    <p className="text-sm text-white/70">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="pt-8"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
              >
                <span>← Back to Blog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center bg-white lg:w-1/2 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <BookOpen className="h-5 w-5 text-accent" />
            </div>
            <span className="text-xl font-playfair font-bold text-textPrimary">
              My Blog
            </span>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-playfair font-bold text-textPrimary">
              Welcome Back
            </h1>
            <p className="text-textSecondary">
              Sign in to access your admin dashboard
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg"
          >
            <LoginForm />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-textSecondary hover:text-accent transition-colors text-sm"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Blog
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
