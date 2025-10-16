"use client";

import { getPosts, Post } from "@/lib/api-client";
import { useEffect, useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Calendar, User, BookOpen, Eye, TrendingUp, Sparkles } from "lucide-react";
import { EnhancedSearch } from "@/components/EnhancedSearch";
import { PostCard } from "@/components/InteractiveCard";
import { LoadingGrid } from "@/components/LoadingAnimations";
import { useToast } from "@/components/Toast";
import { useDebounce } from "@/lib/performance";

const POSTS_PER_PAGE = 6;

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [searchFilters, setSearchFilters] = useState({
    category: '',
    author: '',
    dateRange: '',
    sortBy: 'newest' as 'newest' | 'oldest' | 'popular' | 'trending',
    tags: [] as string[]
  });
  const [isSearching, setIsSearching] = useState(false);

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollY, scrollYProgress } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const { success } = useToast();

  useEffect(() => {
    getPosts().then((posts) => {
      setPosts(posts.filter((post) => post.published));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      setReadingProgress(scrollYProgress.get() * 100);
    };

    const unsubscribe = scrollYProgress.on("change", handleScroll);
    return unsubscribe;
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    setVisiblePosts((prev) => prev + POSTS_PER_PAGE);
  };

  const handleSearch = (query: string, filters: typeof searchFilters) => {
    setSearchTerm(query);
    setSearchFilters(filters);
    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchFilters({
      category: '',
      author: '',
      dateRange: '',
      sortBy: 'newest',
      tags: []
    });
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    // Apply filters
    if (searchFilters.category) {
      // For now, we'll filter by tags since category isn't in the Post interface
      filtered = filtered.filter(post =>
        post.tags?.some(tag => tag.toLowerCase().includes(searchFilters.category.toLowerCase()))
      );
    }

    if (searchFilters.author) {
      filtered = filtered.filter(post => post.author === searchFilters.author);
    }

    if (searchFilters.tags.length > 0) {
      filtered = filtered.filter(post =>
        searchFilters.tags.some(tag => post.tags?.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (searchFilters.sortBy) {
        case 'oldest':
          return (new Date(a.createdAt || 0).getTime()) - (new Date(b.createdAt || 0).getTime());
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'trending':
          // Simple trending algorithm based on recent views
          return (b.views || 0) - (a.views || 0);
        default: // newest
          return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
      }
    });

    return filtered;
  }, [posts, debouncedSearchTerm, searchFilters]);

  const featuredPost = filteredPosts[0];
  const recentPosts = filteredPosts.slice(1, visiblePosts);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-secondary relative overflow-x-hidden">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        transition={{ duration: 0.1 }}
      />

      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/3 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/2 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-accent/20"
          style={{ y: y1, opacity, scale }}
        />
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{ y: y2 }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
        </motion.div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-white/80 text-sm font-medium">Welcome to My Digital Space</span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-playfair font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Welcome to
              <motion.span
                className="block text-accent relative"
                initial={{ opacity: 0, x: -50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                My Blog
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-accent rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={isHeroInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-inter"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Discover stories, insights, and inspiration through carefully crafted articles
              that explore the intersection of technology, creativity, and human experience.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <motion.button
                className="group bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-white/20 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <BookOpen className="w-5 h-5" />
                Explore Articles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/10"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex justify-center gap-8 pt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {[
                { icon: BookOpen, label: "Articles", value: posts.length },
                { icon: Eye, label: "Views", value: "10K+" },
                { icon: TrendingUp, label: "Growth", value: "25%" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                >
                  <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
              <motion.div
                className="w-1 h-3 bg-white/50 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-white/60 text-xs">Scroll to explore</span>
          </div>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, #4E9F3D 25%, transparent 25%), linear-gradient(-45deg, #4E9F3D 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #4E9F3D 75%), linear-gradient(-45deg, transparent 75%, #4E9F3D 75%)`,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-medium">Discover Stories</span>
            </motion.div>

            <h2 className="text-4xl font-playfair font-bold text-textPrimary mb-4">
              Find Your Next Read
            </h2>
            <p className="text-lg text-textSecondary max-w-2xl mx-auto">
              Search through our collection of articles and find exactly what you&apos;re looking for.
            </p>
          </motion.div>

          <EnhancedSearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            placeholder="Search articles, topics, or keywords..."
            categories={["Technology", "Design", "Lifestyle", "Business", "Creative"]}
            authors={["John Doe", "Jane Smith", "Mike Johnson"]}
            tags={["React", "Next.js", "TypeScript", "UI/UX", "Web Development", "JavaScript"]}
            isLoading={isSearching}
            totalResults={filteredPosts.length}
          />
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20 bg-secondary relative">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-48 translate-x-48" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/3 rounded-full blur-3xl translate-y-24 -translate-x-24" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Featured Article</span>
              </motion.div>

              <h2 className="text-4xl font-playfair font-bold text-textPrimary mb-4">
                Editor&apos;s Pick
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <Link href={`/post/${featuredPost.id}`}>
                <div className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white">
                  {/* Image Container */}
                  <div className="relative aspect-[21/9] overflow-hidden">
                    <Image
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      src={`https://source.unsplash.com/random/1200x600/?nature,${featuredPost.id}`}
                      alt={featuredPost.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Floating Badge */}
                    <div className="absolute top-6 left-6">
                      <motion.div
                        className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        Featured
                      </motion.div>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm mb-4">
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Calendar className="w-4 h-4" />
                          <span>Featured Article</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <User className="w-4 h-4" />
                          <span>Author</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <Eye className="w-4 h-4" />
                          <span>2.5K views</span>
                        </div>
                      </div>

                      <motion.h3
                        className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4 group-hover:text-accent transition-colors duration-300 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        {featuredPost.title}
                      </motion.h3>

                      <motion.p
                        className="text-white/90 text-lg leading-relaxed max-w-2xl line-clamp-3 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                      >
                        {featuredPost.content}
                      </motion.p>

                      <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center text-accent font-semibold group-hover:gap-3 transition-all duration-300">
                          <span>Read Full Article</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>

                        <div className="flex items-center gap-4 text-white/60">
                          <motion.button
                            className="p-2 hover:text-accent transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <BookOpen className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            className="p-2 hover:text-accent transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <TrendingUp className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-20 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(78,159,61,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-secondary text-textPrimary px-4 py-2 rounded-full mb-6"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Latest Articles</span>
            </motion.div>

            <h2 className="text-4xl font-playfair font-bold text-textPrimary mb-4">
              Explore Our Stories
            </h2>
            <p className="text-lg text-textSecondary max-w-2xl mx-auto">
              Discover insights, inspiration, and knowledge through our carefully crafted articles.
            </p>
          </motion.div>

          {loading ? (
            <LoadingGrid count={6} />
          ) : recentPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-playfair font-bold text-textPrimary mb-2">
                No articles found
              </h3>
              <p className="text-textSecondary text-lg">
                Try adjusting your search terms or browse all articles.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {recentPosts.map((post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  excerpt={post.content.substring(0, 150) + '...'}
                  author={post.author || 'Anonymous'}
                  date={post.createdAt || new Date().toISOString()}
                  readTime={post.readTime || 5}
                  views={post.views || Math.floor(Math.random() * 1000)}
                  comments={Math.floor(Math.random() * 20)}
                  image={`https://source.unsplash.com/random/800x600/?nature,${post.id}`}
                  tags={post.tags || []}
                  category={post.tags?.[0] || 'Article'}
                  featured={post.featured || false}
                  onClick={() => success(`Opening article: ${post.title}`)}
                />
              ))}
            </motion.div>
          )}

          {visiblePosts < filteredPosts.length && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <motion.button
                onClick={handleLoadMore}
                className="group bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Load More Articles</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter/CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-accent relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '30px 30px'
            }} />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Stay Connected</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Never Miss a Story
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Get notified when I publish new articles and insights. Join our community of curious minds.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-full border-0 focus:ring-4 focus:ring-white/20 transition-all duration-300 outline-none bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                />
                <motion.button
                  className="bg-white hover:bg-gray-50 text-primary px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center items-center gap-6 pt-8 text-white/60"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30" />
                  ))}
                </div>
                <span className="text-sm">2,500+ readers</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Weekly insights</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">No spam, ever</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-accent hover:bg-accent/90 text-white p-4 rounded-full shadow-lg hover:shadow-xl z-50"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowRight className="w-6 h-6 rotate-[-90deg]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
