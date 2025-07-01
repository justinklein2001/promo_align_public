'use client'
import React from 'react';
import { Fab, Badge } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface Change {
  type: 'node_moved' | 'node_deleted' | 'edge_added' | 'edge_deleted';
  description: string;
  nodeId?: string;
  edgeId?: string;
}

interface SaveButtonProps {
  pendingChanges: Change[];
  onSave: () => void;
  isAuthenticated: boolean;
}

export default function SaveButton({ pendingChanges, onSave, isAuthenticated }: SaveButtonProps) {
  if (!isAuthenticated) return null;

  return (
    <Fab
      color="primary"
      sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
      onClick={onSave}
      disabled={pendingChanges.length === 0}
    >
      <Badge badgeContent={pendingChanges.length} color="error">
        <SaveIcon />
      </Badge>
    </Fab>
  );
}
