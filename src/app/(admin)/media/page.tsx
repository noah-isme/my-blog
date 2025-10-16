"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  File,
  Search,
  Grid,
  List,
  Trash2,
  Copy,
  X,
  Plus,
  FolderOpen
} from "lucide-react";
import Image from "next/image";

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'other';
  size: number;
  uploadedAt: string;
  dimensions?: { width: number; height: number };
}

const mockMediaFiles: MediaFile[] = [
  {
    id: '1',
    name: 'hero-image.jpg',
    url: '/api/placeholder/800/400',
    type: 'image',
    size: 2457600,
    uploadedAt: '2024-01-15T10:00:00Z',
    dimensions: { width: 800, height: 400 }
  },
  {
    id: '2',
    name: 'blog-post-1.png',
    url: '/api/placeholder/600/300',
    type: 'image',
    size: 1536000,
    uploadedAt: '2024-01-14T14:30:00Z',
    dimensions: { width: 600, height: 300 }
  },
  {
    id: '3',
    name: 'document.pdf',
    url: '/api/placeholder/document',
    type: 'document',
    size: 512000,
    uploadedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    name: 'presentation.pptx',
    url: '/api/placeholder/presentation',
    type: 'document',
    size: 2048000,
    uploadedAt: '2024-01-12T16:45:00Z'
  }
];

export default function MediaPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockMediaFiles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const filteredFiles = mediaFiles.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDelete = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setMediaFiles(prev => prev.filter(file => file.id !== fileId));
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
      setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'document':
        return <File className="w-8 h-8 text-red-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-playfair font-bold text-textPrimary">
            Media Library
          </h1>
          <p className="mt-1 text-textSecondary">
            Manage your images, documents, and other media files
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Upload className="w-5 h-5" />
            Upload Files
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-textSecondary" />
              <input
                type="text"
                placeholder="Search media files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-3">
            <div className="flex rounded-xl border border-gray-200 bg-white p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-accent text-white'
                    : 'text-textSecondary hover:bg-gray-100'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-accent text-white'
                    : 'text-textSecondary hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-accent/10 border border-accent/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-textPrimary">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFiles([])}
                  className="px-4 py-2 text-sm text-textSecondary hover:text-textPrimary rounded-lg hover:bg-white/50"
                >
                  Clear
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg"
                >
                  Delete Selected
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        {filteredFiles.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-textPrimary mb-2">No files found</h3>
            <p className="text-textSecondary mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first media file to get started'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-semibold"
            >
              <Upload className="w-5 h-5" />
              Upload Files
            </motion.button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-accent transition-colors"
                >
                  <div className="aspect-square relative">
                    {file.type === 'image' ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        fill
                        className="object-cover cursor-pointer"
                        onClick={() => setSelectedFile(file)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        {getFileIcon(file.type)}
                      </div>
                    )}

                    {/* Checkbox */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleFileSelect(file.id)}
                        className="rounded border-gray-300 text-accent focus:ring-accent"
                      />
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyToClipboard(file.url)}
                          className="p-1 bg-white/90 backdrop-blur-sm rounded-lg text-textSecondary hover:text-accent"
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(file.id)}
                          className="p-1 bg-white/90 backdrop-blur-sm rounded-lg text-textSecondary hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="text-sm font-medium text-textPrimary truncate mb-1">
                      {file.name}
                    </h4>
                    <p className="text-xs text-textSecondary">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelect(file.id)}
                    className="rounded border-gray-300 text-accent focus:ring-accent"
                  />

                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-textPrimary">{file.name}</h4>
                      <p className="text-xs text-textSecondary">
                        {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                        {file.dimensions && ` • ${file.dimensions.width}×${file.dimensions.height}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(file.url)}
                      className="p-2 text-textSecondary hover:text-accent rounded-lg hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(file.id)}
                      className="p-2 text-textSecondary hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-textPrimary">{selectedFile.name}</h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                {selectedFile.type === 'image' ? (
                  <Image
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    width={800}
                    height={600}
                    className="max-w-full max-h-96 object-contain mx-auto"
                  />
                ) : (
                  <div className="text-center py-12">
                    {getFileIcon(selectedFile.type)}
                    <p className="mt-4 text-textSecondary">Preview not available for this file type</p>
                  </div>
                )}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-textSecondary">Size</p>
                    <p className="font-medium">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <div>
                    <p className="text-textSecondary">Type</p>
                    <p className="font-medium capitalize">{selectedFile.type}</p>
                  </div>
                  <div>
                    <p className="text-textSecondary">Uploaded</p>
                    <p className="font-medium">{new Date(selectedFile.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  {selectedFile.dimensions && (
                    <div>
                      <p className="text-textSecondary">Dimensions</p>
                      <p className="font-medium">{selectedFile.dimensions.width}×{selectedFile.dimensions.height}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-textPrimary">Upload Files</h3>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-textPrimary mb-2">Drop files here or click to browse</h4>
                  <p className="text-textSecondary mb-4">Supports images, documents, and other media files</p>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                    Choose Files
                  </label>
                </div>
                <p className="text-xs text-textSecondary mt-4">
                  Maximum file size: 10MB. Supported formats: JPG, PNG, PDF, DOC, PPT, TXT
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
