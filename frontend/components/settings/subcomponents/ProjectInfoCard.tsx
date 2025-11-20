'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/elements/card';
import { Label } from '@/elements/label';
import { Project } from '../types';

interface ProjectInfoCardProps {
  project: Project;
}

export function ProjectInfoCard({ project }: ProjectInfoCardProps) {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-white">Project Information</CardTitle>
        <CardDescription className="text-white/70">
          Read-only project details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-white/60 text-xs">Created At</Label>
            <p className="text-sm font-medium text-white">
              {new Date(project.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <Label className="text-white/60 text-xs">Last Updated</Label>
            <p className="text-sm font-medium text-white">
              {new Date(project.updatedAt).toLocaleString()}
            </p>
          </div>
          <div>
            <Label className="text-white/60 text-xs">Project ID</Label>
            <p className="text-sm font-mono text-white/80">{project.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
