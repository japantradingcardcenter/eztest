'use client';

import { Button } from '@/elements/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/elements/card';
import { Input } from '@/elements/input';
import { Label } from '@/elements/label';
import { Textarea } from '@/elements/textarea';
import { Save } from 'lucide-react';
import { Project, ProjectFormData } from '../types';

interface GeneralSettingsCardProps {
  project: Project;
  formData: ProjectFormData;
  saving: boolean;
  onFormChange: (data: ProjectFormData) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function GeneralSettingsCard({
  project,
  formData,
  saving,
  onFormChange,
  onSave,
  onCancel,
}: GeneralSettingsCardProps) {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-white">General Information</CardTitle>
        <CardDescription className="text-white/70">
          Update your project name and description
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onFormChange({ ...formData, name: e.target.value })
              }
              required
              minLength={3}
              maxLength={255}
              placeholder="E-Commerce Platform"
              className="bg-[#0f172a] border-[#334155]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Project Key</Label>
            <Input
              id="key"
              value={project.key}
              disabled
              className="bg-[#0f172a] border-[#334155] cursor-not-allowed opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Project key cannot be changed after creation
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                onFormChange({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Brief description of the project..."
              className="bg-[#0f172a] border-[#334155]"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving} variant="glass-primary">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="glass" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
