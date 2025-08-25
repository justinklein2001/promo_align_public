'use client'
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextField, Button, Stack, CircularProgress, Box, Typography, IconButton
} from '@mui/material';
import Image from 'next/image';
import DeleteIcon from '@mui/icons-material/Delete';
import SongNodeSchema from '../schemas/SongNodeSchema';

interface SongFormProps {
  initialData?: SongNodeData;
  onSubmit: (data: SongNodeData) => Promise<void>;
  onCancel: () => void;
}

export default function SongForm({ initialData, onSubmit, onCancel }: SongFormProps) {
  const [loading, setLoading] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const { control, handleSubmit } = useForm<SongNodeData>({
    resolver: zodResolver(SongNodeSchema),
    defaultValues: {
      title: initialData?.title || '',
      overallObjective: initialData?.overallObjective || '',
      audioFile: initialData?.audioFile || undefined,
      albumCover: initialData?.albumCover || undefined,
    }
  });

  const handleFormSubmit = async (data: SongNodeData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Controller 
          name="title" 
          control={control} 
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              value={field.value || ''} 
              label="Title" 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
            />
          )}
        />
        <Controller 
          name="overallObjective" 
          control={control} 
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              value={field.value || ''} 
              label="Overall Objective" 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
            />
          )}
        />
        <Controller 
          name="audioFile" 
          control={control} 
          render={({ field, fieldState }) => (
            <Box>
              <Box
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
                  if (files.length > 0) {
                    field.onChange(files[0]);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => audioInputRef.current?.click()}
                sx={{ p: 2, border: '2px dashed grey', borderRadius: 2, mb: 2, minHeight: '75px', cursor: 'pointer' }}
              >
                <Typography>Drag and drop or click to select audio file</Typography>
              </Box>
              <input
                type="file"
                accept="audio/*"
                ref={audioInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.type.startsWith('audio/')) {
                    field.onChange(file);
                  }
                }}
              />
              {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
              {field.value && (
                <Box sx={{ position: 'relative' }}>
                  <audio
                    src={typeof field.value === 'string' ? field.value : URL.createObjectURL(field.value)}
                    controls
                    style={{ width: '100%' }}
                  />
                  <IconButton
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={async () => {
                      // If it's a string (existing file), delete it from server
                      if (typeof field.value === 'string') {
                        try {
                          await fetch(`/api/delete-file?path=${encodeURIComponent(field.value)}`, {
                            method: 'DELETE',
                          });
                        } catch (error) {
                          console.error('Failed to delete audio file:', error);
                        }
                      }
                      field.onChange(undefined);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        />
        <Controller 
          name="albumCover" 
          control={control} 
          render={({ field, fieldState }) => (
            <Box>
              <Box
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                  if (files.length > 0) {
                    field.onChange(files[0]);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => coverInputRef.current?.click()}
                sx={{ p: 2, border: '2px dashed grey', borderRadius: 2, mb: 2, minHeight: '75px', cursor: 'pointer' }}
              >
                <Typography>Drag and drop or click to select cover image</Typography>
              </Box>
              <input
                type="file"
                accept="image/*"
                ref={coverInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    field.onChange(file);
                  }
                }}
              />
              {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
              {field.value && (
                <Box sx={{ position: 'relative' }}>
                  <Image
                    src={typeof field.value === 'string' ? field.value : URL.createObjectURL(field.value)}
                    alt="Album Cover"
                    style={{ maxHeight: '140px', width: 'auto' }}
                    unoptimized
                  />
                  <IconButton
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={async () => {
                      // If it's a string (existing file), delete it from server
                      if (typeof field.value === 'string') {
                        try {
                          await fetch(`/api/delete-file?path=${encodeURIComponent(field.value)}`, {
                            method: 'DELETE',
                          });
                        } catch (error) {
                          console.error('Failed to delete album cover:', error);
                        }
                      }
                      field.onChange(undefined);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              )}
            </Box>
          )}
        />
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            Save
          </Button>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
