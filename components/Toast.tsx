"use client"
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Toast({ message, show }: { message: string, show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-lg bg-lightAccent px-6 py-3 text-white shadow-lg dark:bg-darkAccent"
          role="status"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
