import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Breadcrumbs } from '@/components/design/Breadcrumbs';
import { Button } from '@/elements/button';
import { UserManagement } from '@/frontend/components/admin/users';

export const metadata: Metadata = {
  title: 'User Management | EZTest',
  description: 'Manage application users and roles',
};

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  // Check if user is admin
  if (session.user.roleName !== 'ADMIN') {
    redirect('/projects');
  }

  return (
    <div className="flex-1">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Breadcrumbs
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Users' },
            ]}
          />
          <form action="/api/auth/signout" method="POST" className="inline">
            <Button type="submit" variant="glass-destructive" size="sm" className="px-5">
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <UserManagement />
      </div>
    </div>
  );
}
