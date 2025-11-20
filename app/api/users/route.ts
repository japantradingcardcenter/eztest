import { hasPermission } from '@/lib/rbac/hasPermission';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

/**
 * GET /api/users
 * Get all users (admin only)
 * Required permission: users:read
 */
export const GET = hasPermission(
  async (request) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          deletedAt: null, // Only active users
        },
        include: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              projects: true,
              createdProjects: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({
        data: users,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        {
          data: null,
          error: 'Failed to fetch users',
        },
        { status: 500 }
      );
    }
  },
  'users',
  'read'
);

/**
 * POST /api/users
 * Create a new user (admin only)
 * Required permission: users:create
 */
export const POST = hasPermission(
  async (request) => {
    try {
      const body = await request.json();
      const { name, email, password, roleId } = body;

      // Validation
      if (!name || !email || !password || !roleId) {
        return NextResponse.json(
          {
            data: null,
            error: 'Name, email, password, and role are required',
          },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            data: null,
            error: 'User with this email already exists',
          },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          roleId,
        },
        include: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json(
        {
          data: userWithoutPassword,
          error: null,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        {
          data: null,
          error: 'Failed to create user',
        },
        { status: 500 }
      );
    }
  },
  'users',
  'create'
);
