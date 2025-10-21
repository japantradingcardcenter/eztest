# EzTest - Self-Hostable Test Management Platform

## Summary

EzTest is a lightweight, open-source test management platform built with Next.js and designed for self-hosting. It provides an efficient alternative to commercial tools like Testiny and TestRail, optimized to run on minimal hardware (1 CPU core, 2GB RAM). EzTest combines a modern UI with powerful test management capabilities, featuring project management, test organization, execution tracking, and team collaboration—all deployable with Docker.

---

## Installation Guide

### Requirements

- Docker & Docker Compose (recommended)
- Node.js 18+ (for local development)
- PostgreSQL 16 (included in Docker setup)

### Docker Installation (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd eztest.houseoffoss.com
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application:**
   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Open http://localhost:3000 in your browser
   - Default credentials are in your `.env` file

For detailed Docker deployment, production setup, and advanced configuration, see [DOCKER.md](./DOCKER.md).

### Local Development Installation

1. **Clone and install:**
   ```bash
   git clone <repository-url>
   cd eztest.houseoffoss.com
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Update DATABASE_URL in .env
   ```

3. **Set up database:**
   ```bash
   # Start PostgreSQL container
   docker-compose up -d postgres

   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma db push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open http://localhost:3000

---

## Features

### Project Management
- Multi-project support with dedicated workspaces
- Role-based access control (ADMIN, PROJECT_MANAGER, TESTER, VIEWER)
- Team member management and permissions
- Project settings and configuration

### Test Organization
- Hierarchical test suites with nested structure
- Comprehensive test case management
- Test prioritization and status tracking
- Test templates for quick test creation

### Test Execution & Tracking
- Execute tests with real-time progress monitoring
- Track test results with detailed metrics
- Environment-specific test runs
- Test duration and performance logging
- Historical test result analysis

### Requirements Traceability
- Link test cases to requirements
- Traceability matrix for requirements coverage
- Requirements-to-test mapping

### Collaboration & Communication
- Comments on test cases and results
- File attachments for documentation
- Team notifications and activity feeds
- Audit logs for compliance tracking

### Modern User Interface
- Clean, intuitive glass morphism design
- Responsive layout (desktop, tablet, mobile)
- Real-time UI updates
- Accessibility-focused components

### Self-Hosting & Deployment
- Docker containerization for easy deployment
- Docker Compose for one-command setup
- Minimal resource footprint (1 core, 2GB RAM minimum)
- PostgreSQL integration
- Reverse proxy compatible (Nginx, Traefik)
- SSL/TLS support

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, ShadCN UI components
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Deployment**: Docker & Docker Compose

---

## Resource Requirements

| Specification | Minimum | Recommended |
|---|---|---|
| CPU Cores | 1 | 2+ |
| RAM | 2GB | 4GB |
| Storage | 10GB | 20GB |

---

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

# Database commands
npx prisma studio        # Open Prisma Studio
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema changes
npx prisma migrate dev   # Create migration
```

---

## Documentation

- [Technical Documentation](./docs/INDEX.md) - Complete technical documentation
- [Docker Deployment Guide](./DOCKER.md) - Production setup, configuration, and troubleshooting
- [Development Roadmap](./ROADMAP.md) - Future features and planned development
- [Tech Stack](#technology-stack) - Technologies and frameworks used

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Support

For issues and questions:
- GitHub Issues: [Repository URL]
- Documentation: [Docs URL]
