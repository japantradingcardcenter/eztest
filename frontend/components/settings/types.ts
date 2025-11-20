export interface Project {
  id: string;
  name: string;
  key: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFormData {
  name: string;
  description: string;
}
