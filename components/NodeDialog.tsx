'use client'
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import SongForm from './SongForm';
import PromoForm from './PromoForm';

interface NodeDialogProps {
  open: boolean;
  onClose: () => void;
  nodeType: 'song' | 'promo';
  selectedNode: CustomNode | null;
  nodes: CustomNode[];
  deletedNodes: Set<string>;
  onSubmit: (data: PromoNodeData | SongNodeData) => Promise<void>;
}

export default function NodeDialog({ 
  open, 
  onClose, 
  nodeType, 
  selectedNode, 
  nodes, 
  deletedNodes, 
  onSubmit 
}: NodeDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {selectedNode ? 'Edit' : 'Create'} {nodeType} Node
      </DialogTitle>
      <DialogContent>
        {nodeType === 'song' ? (
          <SongForm
            initialData={selectedNode?.data as SongNodeData}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        ) : (
          <PromoForm
            initialData={selectedNode?.data as PromoNodeData}
            onSubmit={onSubmit}
            onCancel={onClose}
            availableSongs={nodes}
            deletedNodes={deletedNodes}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
