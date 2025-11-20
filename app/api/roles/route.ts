import { hasPermission } from '@/lib/rbac/hasPermission';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * GET /api/roles
 * Get all roles
 * Required permission: users:read (only admins need to see roles)
 */
export const GET = hasPermission(
  async (request) => {
    try {
      const roles = await prisma.role.findMany({
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return NextResponse.json({
        data: roles,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      return NextResponse.json(
        {
          data: null,
          error: 'Failed to fetch roles',
        },
        { status: 500 }
      );
    }
  },
  'users',
  'read'
);
