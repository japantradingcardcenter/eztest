'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/elements/dialog';
import { Button } from '@/elements/button';
import { AlertCircle } from 'lucide-react';

interface DeleteUserDialogProps {
  open: boolean;
  userName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteUserDialog({ open, userName, onOpenChange, onConfirm }: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            Delete User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong className="text-white">{userName}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end mt-4">
          <Button variant="glass" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="glass-destructive" onClick={onConfirm}>
            Delete User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
