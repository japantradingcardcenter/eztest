'use client';

import { Button } from '@/elements/button';
import { Plus } from 'lucide-react';
import { Project } from '../types';

interface MembersHeaderProps {
  project: Project;
  onAddMember: () => void;
}

export function MembersHeader({ project, onAddMember }: MembersHeaderProps) {
  return (
    <div className="max-w-6xl mx-auto px-8 pt-8">
      <div className="flex items-center justify-end mb-4">
        <Button variant="glass-primary" size="sm" onClick={onAddMember}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Project Members</h1>
        <p className="text-white/70 text-sm">
          Manage team members for{' '}
          <span className="font-semibold text-white">{project.name}</span>
        </p>
      </div>
    </div>
  );
}
