'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CpuChipIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientText } from '@/components/ui/gradient-text'
import toast from 'react-hot-toast'

interface Document {
  id: string
  title: string
  type: string
  size: number
  uploadDate: Date
  status: 'completed' | 'processing' | 'failed'
  pageCount?: number
  wordCount?: number
}

interface Stats {
  totalDocuments: number
  totalWords: number
  totalQueries: number
  avgResponseTime: number
}

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Q2 2024 Marketing Strategy',
      type: 'PDF',
      size: 2450000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'completed',
      pageCount: 24,
      wordCount: 8500,
    },
    {
      id: '2',
      title: 'Product Roadmap 2024',
      type: 'DOCX',
      size: 1200000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 48),
      status: 'completed',
      pageCount: 15,
      wordCount: 4200,
    },
    {
      id: '3',
      title: 'Customer Support Guidelines',
      type: 'PDF',
      size: 890000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 72),
      status: 'processing',
    },
    {
      id: '4',
      title: 'Technical Documentation',
      type: 'MD',
      size: 450000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 120),
      status: 'completed',
      wordCount: 12000,
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')

  const stats: Stats = {
    totalDocuments: documents.length,
    totalWords: documents.reduce((acc, doc) => acc + (doc.wordCount || 0), 0),
    totalQueries: 1247,
    avgResponseTime: 1.2,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <DocumentArrowDownIcon className="w-4 h-4" />
      case 'processing':
        return <ClockIcon className="w-4 h-4" />
      case 'failed':
        return <ExclamationTriangleIcon className="w-4 h-4" />
      default:
        return <DocumentTextIcon className="w-4 h-4" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedTab === 'all' || doc.status === selectedTab)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => toast('Document upload coming soon!')}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Documents</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalDocuments}</p>
                  <p className="text-blue-100 text-sm mt-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 inline mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FolderIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Words</p>
                  <p className="text-3xl font-bold mt-1">
                    {(stats.totalWords / 1000).toFixed(1)}K
                  </p>
                  <p className="text-purple-100 text-sm mt-2">
                    Across all documents
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Queries</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalQueries}</p>
                  <p className="text-green-100 text-sm mt-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 inline mr-1" />
                    +28% from last week
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg Response Time</p>
                  <p className="text-3xl font-bold mt-1">{stats.avgResponseTime}s</p>
                  <p className="text-orange-100 text-sm mt-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 inline mr-1" />
                    -15% improvement
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CpuChipIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/20 rounded-xl flex items-center justify-center">
                  <PlusIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Upload Document</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add new documents to your knowledge base</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Start Chat</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ask questions about your documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">View Analytics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Track usage and performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Documents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-brand-600" />
                    <GradientText>Documents</GradientText>
                  </CardTitle>
                  <CardDescription>
                    Manage and organize your knowledge base
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => toast('Bulk actions coming soon!')}>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Documents
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                {['all', 'completed', 'processing', 'failed'].map((tab) => (
                  <Button
                    key={tab}
                    variant={selectedTab === tab ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedTab(tab)}
                    className="capitalize"
                  >
                    {tab} ({tab === 'all' ? documents.length : documents.filter(d => d.status === tab).length})
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/20 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {doc.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <DocumentTextIcon className="w-4 h-4" />
                            {doc.type}
                          </span>
                          <span>{formatFileSize(doc.size)}</span>
                          {doc.pageCount && (
                            <span>{doc.pageCount} pages</span>
                          )}
                          {doc.wordCount && (
                            <span>{doc.wordCount.toLocaleString()} words</span>
                          )}
                          <span>{doc.uploadDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toast('Document preview coming soon!')}>
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toast('Document edit coming soon!')}>
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toast('Document share coming soon!')}>
                          <ShareIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toast('Document delete coming soon!')}>
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No documents found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {searchQuery
                        ? 'Try adjusting your search query'
                        : 'Upload your first document to get started'
                      }
                    </p>
                    <Button onClick={() => toast('Document upload coming soon!')}>
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}