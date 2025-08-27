import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';

interface Change {
  type: 'node_moved' | 'node_deleted' | 'edge_added' | 'edge_deleted';
  description: string;
  nodeId?: string;
  edgeId?: string;
}

interface SaveConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: Change[];
  loading?: boolean;
}

const SaveConfirmationModal: React.FC<SaveConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  changes,
  loading = false
}) => {
  const getChangeColor = (type: Change['type']) => {
    switch (type) {
      case 'node_moved':
        return 'primary';
      case 'node_deleted':
        return 'error';
      case 'edge_added':
        return 'success';
      case 'edge_deleted':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getChangeIcon = (type: Change['type']) => {
    switch (type) {
      case 'node_moved':
        return '📍';
      case 'node_deleted':
        return '🗑️';
      case 'edge_added':
        return '🔗';
      case 'edge_deleted':
        return '✂️';
      default:
        return '📝';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Confirm Changes
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Review the changes you want to save to the database
        </Typography>
        {changes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No changes to save
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              {changes.length} change{changes.length !== 1 ? 's' : ''} pending:
            </Typography>
            <List dense>
              {changes.map((change, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Typography sx={{ fontSize: '1.2em' }}>
                        {getChangeIcon(change.type)}
                      </Typography>
                      <ListItemText
                        primary={change.description}
                        sx={{ flex: 1 }}
                      />
                      <Chip
                        label={change.type.replace('_', ' ').toUpperCase()}
                        color={getChangeColor(change.type)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </ListItem>
                  {index < changes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={changes.length === 0 || loading}
          color="primary"
        >
          {loading ? 'Saving...' : `Save ${changes.length} Change${changes.length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveConfirmationModal;
