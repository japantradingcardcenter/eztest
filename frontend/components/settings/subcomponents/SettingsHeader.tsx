'use client';

import { Project } from '../types';

interface SettingsHeaderProps {
  project: Project;
}

export function SettingsHeader({ project }: SettingsHeaderProps) {
  return (
    <div className="max-w-4xl mx-auto px-8 pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Project Settings</h1>
        <p className="text-white/70 text-sm">
          Manage project information and settings for{' '}
          <span className="font-semibold text-white">{project.name}</span>
        </p>
      </div>
    </div>
  );
}
