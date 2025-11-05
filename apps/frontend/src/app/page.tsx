import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

        <div className="relative pt-10 pb-20 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero section */}
            <div className="text-center">
              <div className="flex justify-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/20 dark:text-brand-400 mb-6">
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Powered by Advanced AI
                </div>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white">
                <span className="block">Enterprise AI</span>
                <span className="block text-brand-600">Knowledge Platform</span>
              </h1>

              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
                Transform your organization's knowledge into intelligent conversations.
                Upload documents, ask questions, and get instant AI-powered insights with source attribution.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="text-base px-8 py-3">
                    Get Started Free
                    <ArrowRightIcon className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" size="lg" className="text-base px-8 py-3">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features grid */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center group">
                <div className="mx-auto w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DocumentTextIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Multi-Format Upload
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Support for PDFs, Word documents, text files, web pages, and more formats.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Intelligent Chat
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Natural conversations with AI that understands your documents and provides accurate answers.
                </p>
              </div>

              <div className="text-center group">
                <div className="mx-auto w-16 h-16 bg-brand-100 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ChartBarIcon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Track usage patterns, document processing, and user engagement with detailed analytics.
                </p>
              </div>
            </div>

            {/* Key benefits */}
            <div className="mt-20 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                  Why Choose InsightIQ?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Source Attribution</h3>
                      <p className="text-gray-600 dark:text-gray-300">Every answer includes exact source references from your documents.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Enterprise Security</h3>
                      <p className="text-gray-600 dark:text-gray-300">Bank-level encryption and secure document storage with role-based access.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">Scalable Architecture</h3>
                      <p className="text-gray-600 dark:text-gray-300">Built to handle thousands of users and millions of documents.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">API Integration</h3>
                      <p className="text-gray-600 dark:text-gray-300">RESTful APIs for seamless integration with your existing tools.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Knowledge Management?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of organizations using InsightIQ to make their knowledge accessible and actionable.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="text-base px-8 py-3">
                  Start Your Free Trial
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}