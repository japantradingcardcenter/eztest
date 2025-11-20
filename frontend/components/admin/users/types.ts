export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
  };
  _count?: {
    projects: number;
    createdProjects: number;
  };
}

export interface Role {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface EditUserFormData {
  name: string;
  email: string;
  roleId: string;
  avatar: string;
  bio: string;
  phone: string;
  location: string;
}
