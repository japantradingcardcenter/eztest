# EzTest - Self-Hostable Test Management Platform

A lightweight, open-source test management application built with Next.js, designed to run efficiently on minimal hardware (1 core, 2GB RAM). EzTest provides a modern alternative to commercial tools like Testiny and TestRail.

## Features

- **Project Management** - Multi-project support with role-based access control
- **Test Organization** - Hierarchical test suites and comprehensive test cases
- **Test Execution** - Run tests, track results, and monitor progress
- **Requirements Traceability** - Link test cases to requirements
- **Collaboration** - Comments, attachments, and team collaboration
- **Lightweight** - Optimized for self-hosting on minimal resources
- **Modern UI** - Built with Next.js, Tailwind CSS, and ShadCN UI
- **Fully Self-Hostable** - Docker-based deployment with PostgreSQL

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, ShadCN UI
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Deployment**: Docker & Docker Compose

## Quick Start

### With Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd eztest.houseoffoss.com

# Copy and configure environment
cp .env.example .env
# Edit .env with your settings

# Start with Docker Compose
docker-compose up -d

# Access the application
open http://localhost:3000
```

See [DOCKER.md](./DOCKER.md) for detailed deployment instructions.

### Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Update DATABASE_URL in .env

# Start PostgreSQL (or use Docker)
docker-compose up -d postgres

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema

EzTest includes a comprehensive schema for test management:

- **Users & Roles** - User management with ADMIN, PROJECT_MANAGER, TESTER, VIEWER roles
- **Projects** - Multi-project support with team members and permissions
- **Test Suites** - Hierarchical organization with nested suites
- **Test Cases** - Detailed test cases with steps, priorities, and statuses
- **Test Runs** - Execution tracking with environments and assignments
- **Test Results** - Result logging with duration, comments, and attachments
- **Requirements** - Requirement management and traceability
- **Comments & Attachments** - Collaboration features

## Resource Requirements

**Minimum**:
- 1 CPU Core
- 2GB RAM
- 10GB Storage

**Recommended**:
- 2 CPU Cores
- 4GB RAM
- 20GB Storage

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Prisma commands
npx prisma studio        # Open Prisma Studio
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema changes
npx prisma migrate dev   # Create and apply migration
```

## Project Structure

```
eztest.houseoffoss.com/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   └── ...
├── lib/                # Utility functions and shared code
│   ├── prisma.ts       # Prisma client singleton
│   └── utils.ts        # Utility functions
├── prisma/             # Database schema and migrations
│   └── schema.prisma   # Prisma schema
├── public/             # Static assets
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── DOCKER.md          # Docker deployment guide
```

## Environment Variables

Required environment variables (see `.env.example`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/eztest
NODE_ENV=development
APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

## Deployment

See [DOCKER.md](./DOCKER.md) for comprehensive deployment instructions including:
- Docker Compose setup
- Production configuration
- Reverse proxy setup (Nginx/Traefik)
- SSL/TLS configuration
- Backup strategies
- Monitoring and troubleshooting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Support

For issues and questions:
- GitHub Issues: [Repository URL]
- Documentation: [Docs URL]
