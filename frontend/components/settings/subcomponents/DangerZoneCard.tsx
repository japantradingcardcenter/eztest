'use client';

import { Button } from '@/elements/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/elements/card';
import { Trash2 } from 'lucide-react';
import { Project } from '../types';

interface DangerZoneCardProps {
  project: Project;
  deleting: boolean;
  onDelete: () => void;
}

export function DangerZoneCard({ project, deleting, onDelete }: DangerZoneCardProps) {
  return (
    <Card variant="glass" className="border-red-400/30">
      <CardHeader>
        <CardTitle className="text-red-400">Danger Zone</CardTitle>
        <CardDescription className="text-red-300/70">
          Irreversible and destructive actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border border-red-400/20 rounded-lg bg-red-400/5">
          <div>
            <h4 className="font-semibold text-red-300 mb-1">Delete this project</h4>
            <p className="text-sm text-red-300/70">
              Once you delete a project, there is no going back. All data will be
              permanently deleted.
            </p>
          </div>
          <Button
            variant="glass-destructive"
            onClick={onDelete}
            disabled={deleting}
            className="ml-4"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
