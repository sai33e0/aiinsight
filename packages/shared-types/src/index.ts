// User Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastActive?: string;
  requestsCount: number;
  subscriptionPlan?: SubscriptionPlan;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  API_USER = 'api_user'
}

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Document Types
export interface Document {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  content?: string;
  chunkCount?: number;
  vectorStoreId?: string;
  metadata?: DocumentMetadata;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
}

export enum DocumentStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface DocumentMetadata {
  author?: string;
  description?: string;
  tags?: string[];
  language?: string;
  pageCount?: number;
  wordCount?: number;
}

export interface DocumentUploadRequest {
  file: File;
  title?: string;
  metadata?: DocumentMetadata;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

// Chat & Conversation Types
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessageAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  sources?: MessageSource[];
  confidence?: number;
  feedback?: MessageFeedback;
  tokens?: number;
  createdAt: string;
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system'
}

export interface MessageSource {
  documentId: string;
  documentTitle: string;
  chunkId: string;
  content: string;
  relevanceScore: number;
  pageNumber?: number;
}

export interface MessageFeedback {
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
  documentIds?: string[];
  stream?: boolean;
}

export interface ChatResponse {
  message: Message;
  conversation?: Conversation;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
}

// Analytics Types
export interface UsageAnalytics {
  userId: string;
  period: AnalyticsPeriod;
  totalQueries: number;
  totalDocuments: number;
  totalTokens: number;
  averageResponseTime: number;
  userSatisfaction: number;
  dailyUsage: DailyUsage[];
}

export enum AnalyticsPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export interface DailyUsage {
  date: string;
  queries: number;
  documents: number;
  tokens: number;
  uniqueUsers: number;
}

export interface SystemAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalDocuments: number;
  totalQueries: number;
  totalTokens: number;
  averageResponseTime: number;
  uptime: number;
  errorRate: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Search Types
export interface SearchRequest {
  query: string;
  documentIds?: string[];
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  mimeType?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  author?: string;
}

export interface SearchResult {
  document: Document;
  chunkId: string;
  content: string;
  relevanceScore: number;
  pageNumber?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
}

// WebSocket Types
export interface WebSocketMessage {
  type: WebSocketMessageType;
  data: any;
  timestamp: string;
}

export enum WebSocketMessageType {
  CHAT_STREAM = 'chat_stream',
  DOCUMENT_STATUS = 'document_status',
  ERROR = 'error',
  PING = 'ping',
  PONG = 'pong'
}

export interface ChatStreamMessage {
  conversationId: string;
  messageId: string;
  chunk: string;
  isComplete: boolean;
  sources?: MessageSource[];
}

export interface DocumentStatusMessage {
  documentId: string;
  status: DocumentStatus;
  progress?: number;
  error?: string;
}

// Configuration Types
export interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  maxFileSize: number;
  supportedMimeTypes: string[];
  features: {
    fileUpload: boolean;
    realTimeChat: boolean;
    analytics: boolean;
    multiUser: boolean;
  };
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;