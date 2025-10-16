"use client";

import LoginForm from "@/components/LoginForm";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div
        className="hidden w-1/2 bg-cover bg-center lg:block"
        style={{
          backgroundImage:
            "url(https://source.unsplash.com/random/1200x900/?nature,water)",
        }}
      ></div>
      <div className="flex w-full items-center justify-center bg-gray-100 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h1 className="mb-6 text-center text-3xl font-bold">Login</h1>
            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
