<div align="center">
  <h1 align="center">
    <img src="https://raw.githubusercontent.com/insightiq/aiinsight/main/docs/assets/logo.png" alt="InsightIQ" width="80"/>
  </h1>
  <h2 align="center">
    <font size="6">InsightIQ</font>
  </h2>
  <p align="center">
    <font size="4">Enterprise AI Knowledge Agent Platform</font>
  </p>
  <p align="center">
    <strong>A production-ready AI-powered knowledge management platform that transforms how organizations interact with their data.</strong>
  </p>
  <p align="center">
    <a href="https://insightiq.com">
      <img src="https://img.shields.io/badge/Live%20Demo-Visit-blue?style=for-the-badge" alt="Live Demo">
    </a>
    <a href="https://insightiq.com/docs">
      <img src="https://img.shields.io/badge/Documentation-Read-green?style=for-the-badge" alt="Documentation">
    </a>
    <a href="https://insightiq.com/pricing">
      <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="License">
    </a>
  </p>
</div>

## 🌟 Features

### 🤖 AI-Powered Knowledge Management
- **Intelligent Chat**: Advanced conversational AI with OpenAI GPT-3.5-turbo
- **Context-Aware Responses**: AI that understands your document context
- **Real-Time Streaming**: Live chat responses with typing indicators
- **Source Attribution**: Complete traceability with confidence scoring

### 📄 Multi-Format Document Processing
- **Format Support**: PDF, DOCX, TXT, MD, HTML, CSV, JSON, XML
- **Web Scraping**: Intelligent content extraction from URLs
- **Batch Processing**: Efficient bulk document ingestion
- **Smart Chunking**: Intelligent text segmentation for optimal AI understanding

### 🔍 Advanced Search & Discovery
- **Vector Similarity**: FAISS-powered semantic search
- **Hybrid Search**: Combined vector and keyword search capabilities
- **Real-Time Indexing**: Automatic document vectorization
- **Relevance Scoring**: Confidence-based result ranking

### 📊 Analytics & Insights
- **Usage Analytics**: Comprehensive user and system metrics
- **Performance Monitoring**: AI response times and accuracy tracking
- **Document Insights**: Most accessed and queried content
- **Custom Reports**: Exportable analytics dashboards

### 👥 Enterprise Features
- **Role-Based Access**: Admin, User, API User roles
- **Multi-Tenancy**: Organization and workspace support
- **API Access**: RESTful API for integrations
- **SSO Integration**: Enterprise authentication support

### 🚀 Production Ready
- **Scalable Architecture**: Designed for 10,000+ concurrent users
- **Security First**: Enterprise-grade security and compliance
- **High Performance**: <2s response times for 95% of queries
- **Monitoring**: Comprehensive logging and health checks

## 🏗️ Architecture

### Modern Tech Stack

**Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety throughout the stack
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Server state management
- **Zustand**: Client state management

**Backend**
- **FastAPI**: Modern Python web framework with automatic API documentation
- **SQLAlchemy 2.0**: Async ORM with proper type hints
- **PostgreSQL**: Primary database (via Supabase in production)
- **Redis**: Caching and session management
- **OpenAI**: GPT-3.5-turbo and text-embedding-3-small
- **LangChain**: AI/LLM orchestration and document processing
- **FAISS**: Vector similarity search

**Infrastructure**
- **Docker**: Containerization for consistency
- **Vercel**: Frontend hosting with CI/CD
- **Render**: Backend hosting with Docker support
- **Supabase**: Managed PostgreSQL and Auth services

### Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        A[React Components] --> B[State Management]
        B --> C[API Client]
        C --> D[Error Boundaries]
    end

    subgraph "Backend (FastAPI)"
        E[API Routes] --> F[Business Logic]
        F --> G[AI Services]
        F --> H[Database Layer]
        G --> I[OpenAI/LangChain]
        H --> J[PostgreSQL]
        H --> K[Redis Cache]
    end

    subgraph "AI/ML"
        L[Vector Store] --> M[FAISS Index]
        N[Document Processing] --> O[Multi-format Parser]
        P[OpenAI Integration] --> Q[GPT Models]
    end

    A --> E
    G --> L
    G --> N
    G --> P
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+
- OpenAI API Key

### One-Click Setup

```bash
# Clone the repository
git clone https://github.com/insightiq/aiinsight.git
cd aiinsight

# Run the automated setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Add your OpenAI API key
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env and add your OPENAI_API_KEY

# Start development environment
npm run dev
```

### Manual Setup

```bash
# 1. Install root dependencies
npm install

# 2. Setup frontend
cd apps/frontend
npm install
cd ../..

# 3. Setup backend
cd apps/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..

# 4. Start development services
docker-compose up -d db redis

# 5. Run database migrations (if implemented)
cd apps/backend
alembic upgrade head
cd ../..

# 6. Start application
npm run dev
```

## 🌐 Access Points

After starting the application:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API ReDoc**: http://localhost:8000/redoc

## 📁 Project Structure

```
aiinsight/
├── apps/
│   ├── frontend/                    # Next.js 14 React Application
│   │   ├── src/
│   │   │   ├── app/                # App Router pages
│   │   │   │   ├── (auth)/         # Authentication routes
│   │   │   │   ├── dashboard/       # Dashboard pages
│   │   │   │   ├── chat/            # Chat interface
│   │   │   │   └── analytics/       # Analytics dashboard
│   │   │   ├── components/          # Reusable UI components
│   │   │   │   ├── ui/              # Base UI components
│   │   │   │   ├── forms/           # Form components
│   │   │   │   ├── charts/          # Chart components
│   │   │   │   └── layout/          # Layout components
│   │   │   ├── lib/                # Utilities and configurations
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   ├── store/              # State management
│   │   │   └── types/              # TypeScript definitions
│   │   ├── public/                 # Static assets
│   │   ├── package.json
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   └── backend/                     # FastAPI Python Application
│       ├── app/
│       │   ├── api/                # API routes
│       │   │   ├── v1/             # API version 1
│       │   │   │   ├── auth.py     # Authentication endpoints
│       │   │   │   ├── documents.py # Document management
│       │   │   │   ├── chat.py     # Chat and AI endpoints
│       │   │   │   ├── admin.py    # Admin endpoints
│       │   │   │   └── analytics.py # Analytics endpoints
│       │   │   └── deps.py         # API dependencies
│       │   ├── core/               # Core configuration
│       │   │   ├── config.py       # Settings and environment
│       │   │   ├── security.py     # JWT, password hashing
│       │   │   ├── database.py     # Database setup
│       │   │   └── exceptions.py   # Custom exceptions
│       │   ├── models/             # Database models
│       │   │   ├── user.py         # User model
│       │   │   ├── document.py     # Document model
│       │   │   ├── conversation.py # Conversation model
│       │   │   └── message.py      # Message model
│       │   ├── schemas/            # Pydantic schemas
│       │   ├── services/           # Business logic
│       │   │   ├── ai_service.py   # OpenAI/LangChain integration
│       │   │   ├── document_processor.py # Document processing
│       │   │   ├── vector_store.py # FAISS vector operations
│       │   │   └── auth_service.py # Authentication logic
│       │   └── utils/              # Utility functions
│       ├── requirements.txt
│       ├── Dockerfile
│       └── .env.example
├── packages/
│   └── shared-types/                # Shared TypeScript types
│       ├── src/
│       │   └── index.ts            # Type definitions
│       ├── package.json
│       └── tsconfig.json
├── scripts/                         # Build and deployment scripts
│   ├── setup.sh                    # Development setup script
│   ├── deploy.sh                   # Deployment script
│   └── health-check.sh             # Health check script
├── docs/                           # Documentation
│   ├── assets/                     # Documentation assets
│   ├── api/                        # API documentation
│   ├── deployment/                 # Deployment guides
│   └── development/                # Development guides
├── docker-compose.yml              # Local development environment
├── docker-compose.prod.yml         # Production environment
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore file
├── LICENSE                         # MIT License
├── README.md                       # This file
└── package.json                    # Root workspace configuration
```

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to your local environment and configure:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/insightiq
REDIS_URL=redis://localhost:6379

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# CORS Configuration
CORS_ORIGINS=http://localhost:3000

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Vector Store Configuration
VECTOR_STORE_PATH=./vector_store
EMBEDDING_DIMENSION=1536
SIMILARITY_THRESHOLD=0.7

# Development Settings
DEBUG=true
LOG_LEVEL=INFO
```

### Frontend Environment

Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                    # Start all development servers
npm run dev:frontend           # Start frontend only
npm run dev:backend            # Start backend only

# Building
npm run build                  # Build entire project
npm run build:frontend         # Build frontend only
npm run build:backend          # Build backend only

# Testing
npm run test                   # Run all tests
npm run test:frontend          # Run frontend tests
npm run test:backend           # Run backend tests
npm run test:e2e               # Run end-to-end tests

# Code Quality
npm run lint                   # Lint all code
npm run lint:frontend          # Lint frontend only
npm run lint:backend           # Lint backend only
npm run type-check             # Run TypeScript checks

# Docker
npm run docker:dev             # Start with Docker (development)
npm run docker:prod            # Start with Docker (production)
docker-compose up -d           # Start database services only
docker-compose down            # Stop all services
```

### Database Management

```bash
# Create migrations
cd apps/backend
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migrations
alembic downgrade -1
```

## 🐳 Docker Deployment

### Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Environment

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up --build -d

# Scale services
docker-compose -f docker-compose.prod.yml up --scale backend=3 --scale frontend=2
```

## 🚀 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
cd apps/frontend
vercel --prod
```

### Render (Backend)

```bash
# Using the deployment script
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

### Manual Deployment

1. **Frontend**: Deploy to Vercel, Netlify, or any static hosting
2. **Backend**: Deploy to Render, AWS, Google Cloud, or your preferred cloud provider
3. **Database**: Use managed PostgreSQL service (Supabase, AWS RDS, etc.)
4. **Redis**: Use managed Redis service (Redis Cloud, AWS ElastiCache, etc.)

## 📊 Monitoring & Analytics

### Health Checks

- **Frontend Health**: `GET /` should return the application
- **Backend Health**: `GET /health` returns service status
- **Database Health**: `GET /api/v1/admin/system/health` (admin only)

### Metrics

- **Response Times**: Track API response times
- **Error Rates**: Monitor application errors
- **Usage Analytics**: User engagement and feature usage
- **AI Performance**: Token usage and response accuracy

### Logging

- **Structured Logging**: JSON-formatted logs for easy parsing
- **Error Tracking**: Automatic error reporting and alerting
- **Performance Metrics**: Request timing and resource usage

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper testing
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards

- **TypeScript**: Strict type checking
- **ESLint**: Follow linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Unit tests for new features
- **Documentation**: Update docs for API changes

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For the powerful GPT models that power our AI capabilities
- **LangChain**: For the excellent LLM orchestration framework
- **FAISS**: For the efficient vector similarity search
- **Vercel**: For the amazing Next.js hosting platform
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support

- **Documentation**: [docs.insightiq.com](https://docs.insightiq.com)
- **Issues**: [GitHub Issues](https://github.com/insightiq/aiinsight/issues)
- **Discussions**: [GitHub Discussions](https://github.com/insightiq/aiinsight/discussions)
- **Email**: support@insightiq.com

---

<div align="center">
  <p>
    <strong>Made with ❤️ by the InsightIQ Team</strong>
  </p>
  <p>
    <em>Transforming knowledge into intelligent conversations</em>
  </p>
</div>