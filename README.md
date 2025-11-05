# InsightIQ: Enterprise AI Knowledge Agent Platform

A production-ready AI-powered knowledge agent platform that can ingest documents, websites, and structured data, then provide intelligent responses with source attribution.

## Features

- 🤖 **AI-Powered Chat**: Advanced conversational AI with OpenAI integration
- 📄 **Multi-Format Ingestion**: Support for PDF, DOCX, TXT, and web content
- 🔍 **Intelligent Search**: Vector similarity search with hybrid capabilities
- 📊 **Source Attribution**: Complete traceability with confidence scoring
- 👥 **User Management**: Role-based access control and analytics
- 📈 **Analytics Dashboard**: Usage insights and performance metrics
- 🚀 **Enterprise Ready**: Production deployment with scalability

## Architecture

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python + SQLAlchemy
- **Database**: PostgreSQL with Redis caching
- **AI**: OpenAI GPT-3.5-turbo + LangChain + FAISS
- **Deployment**: Vercel (frontend) + Render (backend)

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aiinsight

# Set up the entire project
npm run setup

# Start development environment
npm run dev
```

### Manual Setup

```bash
# Install dependencies
npm install

# Frontend setup
cd apps/frontend
npm install

# Backend setup
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start services
npm run dev
```

## Development

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Docker Development

```bash
# Development environment
npm run docker:dev

# Production environment
npm run docker:prod
```

## Project Structure

```
aiinsight/
├── apps/
│   ├── frontend/           # Next.js application
│   └── backend/            # FastAPI application
├── packages/
│   ├── shared-types/       # Shared TypeScript types
│   └── shared-utils/       # Shared utilities
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
└── docker-compose.yml      # Local development
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/insightiq
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE_HOURS=24

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

## Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run test` - Run all tests
- `npm run lint` - Lint code
- `npm run docker:dev` - Docker development
- `npm run docker:prod` - Docker production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the repository.