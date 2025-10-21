# Authentication & Authorization

## Overview

EZTest uses NextAuth.js with JWT-based sessions for authentication and implements a two-tier role system: system-level roles (User model) and project-level roles (ProjectMember model).

## Authentication System

### NextAuth.js Configuration (`lib/auth.ts`)

```typescript
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({ /* credentials login */ })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,  // 30 days
  },
  callbacks: {
    async jwt({ token, user }) { /* token generation */ },
    async session({ session, token }) { /* session enrichment */ }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

**Key Components:**
- **Provider**: Credentials-based (email/password)
- **Adapter**: Prisma for session storage
- **Strategy**: JWT tokens with 30-day expiry
- **Secret**: Signing key for token integrity

### Authentication Flow

#### 1. Registration

```
POST /api/auth/register
    ↓
Input validation
    ↓
Hash password (bcryptjs, 10 rounds)
    ↓
Create user in database
    ↓
Return success/error response
```

**Endpoint**: `app/api/auth/register/route.ts`

```typescript
export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  // Validate input
  if (!email || !password || password.length < 8) {
    return Response('Invalid credentials', { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return Response.json(user, { status: 201 });
}
```

#### 2. Login (Credentials Provider)

```
POST /api/auth/callback/credentials
    ↓
CredentialsProvider.authorize()
    ↓
Verify email exists
    ↓
Compare password with hash
    ↓
Generate JWT token
    ↓
Return user object
```

**Provider Implementation** (`lib/auth.ts`):

```typescript
CredentialsProvider({
  name: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    // 1. Validate input
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password required');
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 3. Verify password
    const isValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // 4. Return user data
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },
}),
```

#### 3. Session Management

```
JWT Callback (token generation)
    ↓
Encode user data into JWT
    ↓
Sign with NEXTAUTH_SECRET
    ↓
Set 30-day expiry
    ↓
Return token
    ↓
    ↓
Session Callback (session enrichment)
    ↓
Attach token data to session
    ↓
Return session to client
```

**Callback Implementation**:

```typescript
callbacks: {
  async jwt({ token, user }) {
    // Add user data to token when user logs in
    if (user) {
      token.id = user.id;
      token.role = user.role;
    }
    return token;
  },
  async session({ session, token }) {
    // Add token data to session
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as UserRole;
    }
    return session;
  },
}
```

### Session Types

```typescript
// NextAuth Session Type
type Session = {
  user: {
    id: string;        // User ID
    email: string;     // Email
    name: string;      // Display name
    role: UserRole;    // System role
    image?: string;    // Avatar
  };
  expires: string;     // ISO timestamp
}
```

## Authorization System

### Two-Tier Role Structure

#### System-Level Roles (User.role)

Defined at the user account level:

```
ADMIN            → Full system access
PROJECT_MANAGER  → Can create/manage projects
TESTER           → Can execute tests (default)
VIEWER           → Read-only access
```

**Usage**:
```typescript
// Check system role
if (session.user.role === 'ADMIN') {
  // Allow administrative actions
}
```

#### Project-Level Roles (ProjectMember.role)

Defined per project membership:

```
OWNER    → Full project control
ADMIN    → Can manage project members and settings
TESTER   → Can execute tests
VIEWER   → Read-only access (default)
```

**Example**:
```typescript
// Check project role
const membership = await prisma.projectMember.findUnique({
  where: {
    projectId_userId: {
      projectId: req.projectId,
      userId: session.user.id,
    }
  }
});

if (membership?.role === 'OWNER') {
  // Allow project ownership actions
}
```

### Authorization Patterns

#### 1. System-Level Authorization

```typescript
// Only admins can access
if (session.user.role !== 'ADMIN') {
  return new Response('Unauthorized', { status: 403 });
}
```

#### 2. Project-Level Authorization

```typescript
// Check if user is project member
const member = await prisma.projectMember.findUnique({
  where: {
    projectId_userId: { projectId, userId }
  }
});

if (!member) {
  return new Response('Not a project member', { status: 403 });
}
```

#### 3. Resource Ownership

```typescript
// Only creator can delete
const testCase = await prisma.testCase.findUnique({
  where: { id }
});

if (testCase.createdById !== session.user.id) {
  return new Response('Unauthorized', { status: 403 });
}
```

#### 4. Combined Authorization

```typescript
// Must be project owner AND have system admin role
const member = await prisma.projectMember.findUnique({
  where: { projectId_userId: { projectId, userId } }
});

if (session.user.role !== 'ADMIN' || member?.role !== 'OWNER') {
  return new Response('Insufficient permissions', { status: 403 });
}
```

## Middleware Authentication (`middleware.ts`)

Route protection layer that runs before handlers:

```typescript
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // Public routes (no auth required)
        const publicRoutes = [
          '/auth/',
          '/api/auth/',
          '/',           // Home
          '/ui',         // UI showcase
        ];

        const isPublic = publicRoutes.some(route =>
          pathname.startsWith(route)
        );

        if (isPublic) return true;

        // Protected routes (require token)
        return !!token;
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/health).*)',
  ],
};
```

### Middleware Flow

```
Request arrives
    ↓
Middleware evaluates pathname
    ↓
Is route public?
    ├─ Yes → Allow through
    └─ No → Check for valid token
           ├─ Valid → Allow through
           └─ Invalid → Redirect to /auth/login
```

## Getting Session in Pages

### Server Components

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Dashboard() {
  // Get session on server
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Use session data
  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

### API Routes

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  if (session.user.role !== 'ADMIN') {
    return new Response('Forbidden', { status: 403 });
  }

  // Authorized action
  return Response.json({ data: 'secret' });
}
```

## Password Security

### Hashing Algorithm

- **Library**: bcryptjs
- **Rounds**: 10 (default)
- **Cost**: ~100ms per hash

```typescript
// Hashing (during registration)
const hashed = await bcrypt.hash(plainPassword, 10);

// Verification (during login)
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### Password Requirements (Recommended)

- Minimum 8 characters
- Should include mixed case, numbers, and symbols
- No dictionary words
- Enforce during registration

### Storage

- Passwords NEVER stored in plain text
- Only hashed passwords in database
- Never log passwords
- Use HTTPS for transport

## Session Security

### JWT Token Details

```
Header: { alg: 'HS256', typ: 'JWT' }
Payload: {
  id: 'user-id',
  role: 'TESTER',
  email: 'user@example.com',
  iat: 1234567890,
  exp: 1234654290,  // 30 days later
}
Signature: HMACSHA256(
  header + payload,
  NEXTAUTH_SECRET
)
```

### Token Expiration

- **Duration**: 30 days
- **Renewal**: Automatic on each request
- **Logout**: Token invalidation (client-side)

### Environment Variables

```env
# Required for production
NEXTAUTH_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=https://example.com      # Full URL with protocol
```

## Session Storage

### Server-Side Storage

- NextAuth uses Prisma Adapter
- Session data stored in database
- Associates JWT tokens with users
- Enables session lookup and validation

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Client-Side Storage

- NextAuth stores JWT in HTTP-only cookie
- Browser cannot access cookie (security)
- Automatically sent with requests
- Cleared on logout

## Authentication Errors

### Login Errors

```typescript
// Invalid credentials error
throw new Error('Invalid email or password');

// Missing fields error
throw new Error('Email and password are required');

// User not found
throw new Error('No account with this email');
```

### Session Errors

- **Expired**: Token expires, user redirected to login
- **Invalid**: Token tampered with, rejected
- **Missing**: No token in request, redirect to login

## Logout Flow

```
User clicks Sign Out
    ↓
POST /api/auth/signout
    ↓
NextAuth destroys session
    ↓
JWT token invalidated
    ↓
Redirect to /auth/login
```

## Common Workflows

### 1. Protect a Route

```typescript
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Protected code here
}
```

### 2. Check User Permissions

```typescript
const canEdit = session.user.role === 'ADMIN' ||
  testCase.createdById === session.user.id;

if (!canEdit) {
  throw new Error('You do not have permission');
}
```

### 3. Add User to Project

```typescript
const user = await prisma.user.findUnique({
  where: { email }
});

await prisma.projectMember.create({
  data: {
    projectId,
    userId: user.id,
    role: 'TESTER',
  }
});
```

## Future Security Enhancements

1. **Multi-Factor Authentication (MFA)** - TOTP support
2. **OAuth Providers** - Google, GitHub login
3. **Password Reset** - Email-based recovery
4. **Session Revocation** - Immediate logout everywhere
5. **Rate Limiting** - Prevent brute force attacks
6. **Audit Logging** - Track all auth events

