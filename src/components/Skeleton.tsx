import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 animate-pulse';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function PostSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton width="30%" className="mb-2" />
          <Skeleton width="20%" />
        </div>
      </div>
      <Skeleton width="90%" className="mb-2" />
      <Skeleton width="80%" className="mb-2" />
      <Skeleton width="60%" />
      <div className="flex gap-2 mt-4">
        <Skeleton width={60} height={24} className="rounded-full" />
        <Skeleton width={80} height={24} className="rounded-full" />
      </div>
    </motion.div>
  );
}

export function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <Skeleton height={200} className="w-full" />
          <div className="p-4">
            <Skeleton width="80%" className="mb-2" />
            <Skeleton width="60%" className="mb-3" />
            <div className="flex gap-2">
              <Skeleton width={50} height={20} className="rounded-full" />
              <Skeleton width={70} height={20} className="rounded-full" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton width={100} />
            <Skeleton width={60} />
          </div>
          <Skeleton width="85%" className="mb-1" />
          <Skeleton width="70%" className="mb-1" />
          <Skeleton width="40%" />
          <div className="flex gap-4 mt-3">
            <Skeleton width={40} height={20} />
            <Skeleton width={50} height={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton width={60} height={60} variant="circular" />
              <Skeleton width={40} height={20} />
            </div>
            <Skeleton width="70%" className="mb-2" />
            <Skeleton width="50%" />
          </motion.div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <Skeleton width={150} className="mb-4" />
          <Skeleton height={300} className="w-full rounded-lg" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <Skeleton width={120} className="mb-4" />
          <Skeleton height={300} className="w-full rounded-lg" />
        </motion.div>
      </div>
    </div>
  );
}