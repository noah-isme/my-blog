'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'text-blue-500',
  className = ''
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-2 border-gray-200 dark:border-gray-700 border-t-${color.split('-')[1]} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export function LoadingDots({
  size = 'md',
  color = 'bg-blue-500',
  className = ''
}: LoadingDotsProps) {
  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 0, -10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center gap-1 ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${sizes[size]} ${color} rounded-full`}
          variants={dotVariants}
        />
      ))}
    </motion.div>
  );
}

interface LoadingPulseProps {
  className?: string;
  children?: React.ReactNode;
}

export function LoadingPulse({ className = '', children }: LoadingPulseProps) {
  return (
    <motion.div
      className={`animate-pulse ${className}`}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
  title?: boolean;
  subtitle?: boolean;
}

export function LoadingSkeleton({
  className = '',
  lines = 3,
  avatar = false,
  title = true,
  subtitle = false
}: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {avatar && (
        <LoadingPulse>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </LoadingPulse>
      )}

      {title && (
        <LoadingPulse>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </LoadingPulse>
      )}

      {subtitle && (
        <LoadingPulse>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </LoadingPulse>
      )}

      {Array.from({ length: lines }).map((_, index) => (
        <LoadingPulse key={index}>
          <div
            className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          />
        </LoadingPulse>
      ))}
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className = '' }: LoadingCardProps) {
  return (
    <LoadingPulse>
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 ${className}`}>
        <div className="space-y-4">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        </div>
      </div>
    </LoadingPulse>
  );
}

interface LoadingGridProps {
  count?: number;
  className?: string;
}

export function LoadingGrid({ count = 6, className = '' }: LoadingGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <LoadingCard />
        </motion.div>
      ))}
    </div>
  );
}