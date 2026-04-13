import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getServerSession } from 'next-auth';
import { prisma } from './prisma';
import { getEnv } from './env-validation';
import { UnauthorizedException } from '@/backend/utils/exceptions';
import { BaseApiMethod, baseInterceptor } from '@/backend/utils/baseInterceptor';
import { CustomRequest } from '@/backend/utils/interceptor';

// Validate environment on import
const env = getEnv();

const providers: NextAuthOptions['providers'] = [
  GoogleProvider({
    clientId: env.googleClientId!,
    clientSecret: env.googleClientSecret!,
  }),
];

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // ドメイン制限チェック
        if (!env.googleAllowedDomain) {
          console.error('[Google Auth] GOOGLE_ALLOWED_DOMAIN is not set');
          return false;
        }
        if (!user.email?.endsWith(`@${env.googleAllowedDomain}`)) {
          return false;
        }

        // 新規ユーザーの場合はDBに作成
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existing) {
          const testerRole = await prisma.role.findFirst({
            where: { name: 'TESTER' },
          });
          if (!testerRole) {
            console.error('[Google Auth] TESTER role not found');
            return false;
          }
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name ?? user.email,
              roleId: testerRole.id,
            },
          });
        } else if (existing.deletedAt) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      // emailからDBのユーザー情報を取得（Googleログイン時はuser.idが未設定のため）
      const emailToLookup = token.email;
      if (emailToLookup) {
        const dbUser = await prisma.user.findUnique({
          where: { email: emailToLookup },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.roleName = dbUser.role.name || 'TESTER';
          token.permissions = dbUser.role.permissions?.map(
            (rp) => rp.permission.name
          ) || [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roleName = token.roleName as string;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
  secret: env.nextAuthSecret,
  debug: env.nodeEnv === 'development',
};

/**
 * Get the current authenticated session
 */
export async function auth() {
  return await getServerSession(authOptions);
}

/**
 * Check permission middleware (deprecated - use hasPermission from lib/rbac instead)
 * This function is kept for backward compatibility with existing API routes
 * that haven't been migrated to the new RBAC system yet.
 *
 * @deprecated Use getSessionUser() and hasPermission() from lib/rbac instead
 */
export function checkPermission(
  apiMethod: BaseApiMethod<CustomRequest>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  module: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  action: string
): BaseApiMethod<CustomRequest> {
  return async (request, context) => {
    const session = await auth();

    if (!session || !session.user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!session.user.roleName) {
      throw new UnauthorizedException('No Access');
    }

    // Attach user info to request
    // Note: scopeInfo is deprecated and kept only for backward compatibility
    request.scopeInfo = { access: true, scope_name: 'all' };
    request.userInfo = {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.name || '',
      role: session.user.roleName || 'TESTER'
    };

    const response = await apiMethod(request, context);
    return response;
  };
}

/**
 * Main permission wrapper for API routes (deprecated)
 * @deprecated Use getSessionUser() and hasPermission() from lib/rbac instead
 *
 * Example migration:
 * OLD: export const GET = hasPermission(handler, 'prn', 'r');
 * NEW:
 * export async function GET(request: NextRequest) {
 *   const user = await getSessionUser();
 *   if (!hasPermission(user, 'projects:read')) {
 *     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
 *   }
 *   // ... handler logic
 * }
 */
export const hasPermission = (
  apiMethod: BaseApiMethod<CustomRequest>,
  scope: string,
  action: string
) => baseInterceptor(checkPermission(apiMethod, scope, action));
