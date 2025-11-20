'use client';

import { Button } from '@/elements/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/elements/dialog';

interface RemoveMemberDialogProps {
  open: boolean;
  memberName: string | null;
  deleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RemoveMemberDialog({
  open,
  memberName,
  deleting,
  onOpenChange,
  onConfirm,
}: RemoveMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Team Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {memberName} from this project?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-red-300">
            <p className="font-semibold mb-2">This action will:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Remove this member&apos;s access to the project</li>
              <li>Revoke their permissions immediately</li>
              <li>This can be reversed by re-adding the member</li>
            </ul>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="glass"
              onClick={() => onOpenChange(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="glass-destructive"
              onClick={onConfirm}
              disabled={deleting}
            >
              {deleting ? 'Removing...' : 'Remove Member'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
