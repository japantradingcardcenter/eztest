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
  error: string;
  successMessage: string;
  onFormChange: (data: ProjectFormData) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function GeneralSettingsCard({
  project,
  formData,
  saving,
  error,
  successMessage,
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Project Key</Label>
            <Input
              id="key"
              value={project.key}
              disabled
              className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed backdrop-blur-none"
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
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-sm text-green-400 bg-green-400/10 border border-green-400/20 p-3 rounded-md">
              {successMessage}
            </div>
          )}

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
