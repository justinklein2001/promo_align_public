'use client'
import React from 'react';
import { Box, Button } from '@mui/material';
import Link from 'next/link';

interface AppToolbarProps {
  isAuthenticated: boolean;
  onAddSongNode: () => void;
  onAddPromoNode: () => void;
  onLogout: () => void;
}

export default function AppToolbar({ 
  isAuthenticated, 
  onAddSongNode, 
  onAddPromoNode, 
  onLogout 
}: AppToolbarProps) {
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box>
        {isAuthenticated && (
          <>
            <Button onClick={onAddSongNode} color="secondary" variant="contained" sx={{ mr: 2 }}>
              Add Song Node
            </Button>
            <Button onClick={onAddPromoNode} color="primary" variant="contained">
              Add Promo Node
            </Button>
          </>
        )}
      </Box>
      <Box>
        {isAuthenticated ? (
          <Button onClick={onLogout} color="error">
            Logout
          </Button>
        ) : (
          <Link href="/login">
            <Button variant="contained">Login</Button>
          </Link>
        )}
      </Box>
    </Box>
  );
}
