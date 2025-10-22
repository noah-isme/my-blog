"use client";
import { AnimatePresence, motion } from 'framer-motion';
import ReadingProgressBar from './ReadingProgressBar';
import SoundFeedback from './SoundFeedback';
import type { ReactNode } from 'react';

export default function AppClientShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SoundFeedback />
      <ReadingProgressBar />
      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          role="main"
          className="mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-6 lg:py-16"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </>
  );
}
