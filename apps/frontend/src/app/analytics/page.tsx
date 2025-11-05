'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  FunnelIcon,
  DownloadIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GradientText } from '@/components/ui/gradient-text'

const usageData = [
  { date: 'Mon', queries: 145, users: 89, documents: 12 },
  { date: 'Tue', queries: 167, users: 92, documents: 15 },
  { date: 'Wed', queries: 189, users: 98, documents: 18 },
  { date: 'Thu', queries: 156, users: 95, documents: 14 },
  { date: 'Fri', queries: 198, users: 102, documents: 22 },
  { date: 'Sat', queries: 134, users: 78, documents: 8 },
  { date: 'Sun', queries: 112, users: 65, documents: 6 },
]

const documentTypes = [
  { name: 'PDF', value: 45, color: '#3B82F6' },
  { name: 'DOCX', value: 25, color: '#8B5CF6' },
  { name: 'TXT', value: 15, color: '#10B981' },
  { name: 'MD', value: 10, color: '#F59E0B' },
  { name: 'Other', value: 5, color: '#EF4444' },
]

const queryCategories = [
  { category: 'Summarization', queries: 345, avgResponseTime: 1.2 },
  { category: 'Q&A', queries: 287, avgResponseTime: 0.8 },
  { category: 'Analysis', queries: 198, avgResponseTime: 2.1 },
  { category: 'Comparison', queries: 156, avgResponseTime: 1.5 },
  { category: 'Generation', queries: 89, avgResponseTime: 3.2 },
]

const topDocuments = [
  { title: 'Q2 2024 Marketing Strategy', queries: 234, views: 1456 },
  { title: 'Product Roadmap 2024', queries: 189, views: 987 },
  { title: 'Customer Support Guidelines', queries: 167, views: 876 },
  { title: 'Technical Documentation', queries: 145, views: 654 },
  { title: 'Sales Training Manual', queries: 123, views: 543 },
]

const MetricsCard = ({ title, value, change, changeType, icon, iconColor }: {
  title: string
  value: string | number
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ReactNode
  iconColor: string
}) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            {changeType === 'increase' ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('queries')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monitor usage and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              <Button variant="outline">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <MetricsCard
            title="Total Queries"
            value="1,101"
            change="+12.5%"
            changeType="increase"
            icon={<ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />}
            iconColor="bg-blue-500"
          />
          <MetricsCard
            title="Active Users"
            value="89"
            change="+8.2%"
            changeType="increase"
            icon={<UserGroupIcon className="w-6 h-6 text-white" />}
            iconColor="bg-green-500"
          />
          <MetricsCard
            title="Documents Processed"
            value="95"
            change="+15.3%"
            changeType="increase"
            icon={<DocumentTextIcon className="w-6 h-6 text-white" />}
            iconColor="bg-purple-500"
          />
          <MetricsCard
            title="Avg Response Time"
            value="1.3s"
            change="-5.1%"
            changeType="decrease"
            icon={<ChartBarIcon className="w-6 h-6 text-white" />}
            iconColor="bg-orange-500"
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Usage Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>
                  Track queries, users, and document uploads over time
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  {['queries', 'users', 'documents'].map((metric) => (
                    <Button
                      key={metric}
                      variant={selectedMetric === metric ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedMetric(metric)}
                      className="capitalize"
                    >
                      {metric}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Document Types Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Document Types</CardTitle>
                <CardDescription>
                  Distribution of document types in your knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={documentTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {documentTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Query Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Query Categories</CardTitle>
              <CardDescription>
                Performance metrics by query type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={queryCategories}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="queries" fill="#3B82F6" name="Queries" />
                  <Bar yAxisId="right" dataKey="avgResponseTime" fill="#10B981" name="Avg Response Time (s)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Documents Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Documents</CardTitle>
              <CardDescription>
                Most accessed and queried documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        Document
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        Queries
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        Views
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        Engagement
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDocuments.map((doc, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/20 rounded-lg flex items-center justify-center">
                              <DocumentTextIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {doc.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {doc.queries}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {doc.views.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-brand-600 to-brand-400 h-2 rounded-full"
                                style={{
                                  width: `${(doc.queries / 250) * 100}%`
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {Math.round((doc.queries / 250) * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm">
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}