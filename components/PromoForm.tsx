'use client'
import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, CircularProgress, Box, Select, MenuItem, FormControl, InputLabel, Typography, IconButton, CardMedia } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PromoNodeSchema from '../schemas/PromoNodeSchema';

interface PromoFormProps {
  initialData?: PromoNodeData;
  onSubmit: (data: PromoNodeData) => Promise<void>;
  onCancel: () => void;
  availableSongs: CustomNode[];
  deletedNodes: Set<string>;
}

export default function PromoForm({ initialData, onSubmit, onCancel, availableSongs, deletedNodes }: PromoFormProps) {
  const [loading, setLoading] = useState(false);
  const [videoPreviews, setVideoPreviews] = useState<(File | string)[]>(initialData?.sketches || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { control, handleSubmit } = useForm<PromoNodeData>({
    resolver: zodResolver(PromoNodeSchema),
    defaultValues: {
      title: initialData?.title || '',
      sceneObjective: initialData?.sceneObjective || '',
      parentSong: initialData?.parentSong || '',
      type: initialData?.type || '',
      recommendation: initialData?.recommendation || '',
      alignmentScore: initialData?.alignmentScore || 0,
      sketches: initialData?.sketches || [],
    }
  });

  const handleFormSubmit = async (data: PromoNodeData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent, currentSketches: (File | string)[], onChange: (files: (File | string)[]) => void) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('video/') || file.type.startsWith('image/')
    );
    const merged = [...currentSketches, ...files];
    onChange(merged);
    setVideoPreviews(merged);
  };

  const removePreview = (index: number, currentSketches: (File | string)[], onChange: (files: (File | string)[]) => void) => {
    const newPreviews = videoPreviews.filter((_, i) => i !== index);
    const newSketches = currentSketches.filter((_, i) => i !== index);
    setVideoPreviews(newPreviews);
    onChange(newSketches);
  };

  const isVideo = (preview: File | string) => {
    if (typeof preview === 'string') {
      return /\.(mp4|webm|ogg|mov)$/i.test(preview);
    } else {
      return preview.type.includes('video/');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const songOptions = availableSongs.filter(n => n.type === 'song' && !deletedNodes.has(n.id));

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
          name="sceneObjective" 
          control={control} 
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              value={field.value || ''} 
              label="Scene Objective" 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
            />
          )}
        />
        <Controller 
          name="parentSong" 
          control={control} 
          render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error}>
              <InputLabel>Parent Song</InputLabel>
              <Select 
                {...field} 
                value={field.value || ''} 
                label="Parent Song"
              >
                {songOptions.map(n => (
                  <MenuItem key={n.id} value={n.id}>{n.data.title}</MenuItem>
                ))}
              </Select>
              {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
            </FormControl>
          )}
        />
        <Controller 
          name="type" 
          control={control} 
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              value={field.value || ''} 
              label="Type" 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
            />
          )}
        />
        <Controller 
          name="recommendation" 
          control={control} 
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              value={field.value || ''} 
              label="Recommendation" 
              error={!!fieldState.error} 
              helperText={fieldState.error?.message} 
            />
          )}
        />
        <Controller 
          name="alignmentScore" 
          control={control} 
          render={({ field, fieldState }) => (
            <TextField 
              {...field} 
              value={field.value || 0} 
              type="number" 
              label="Alignment Score" 
              error={!!fieldState.error}
              helperText={fieldState.error?.message} 
              onChange={(e) => field.onChange(Number(e.target.value))} 
            />
          )}
        />
        <Controller 
          name="sketches" 
          control={control} 
          render={({ field, fieldState }) => (
            <Box>
              <Box
                onDrop={(e) => handleDrop(e, field.value || [], field.onChange)}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                sx={{ p: 2, border: '2px dashed grey', borderRadius: 2, mb: 2, minHeight: '75px', cursor: 'pointer' }}
              >
                <Typography>Drag and drop or click to select videos/images</Typography>
              </Box>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).filter((file) =>
                    file.type.startsWith('image/') || file.type.startsWith('video/')
                  );
                  const merged = [...(field.value || []), ...files];
                  field.onChange(merged);
                  setVideoPreviews(merged);
                }}
              />
              {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
              <Stack direction="column" spacing={1} sx={{ mt: 2, maxHeight: '300px', overflowY: 'auto'}}>
                {videoPreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    {isVideo(preview) ? (
                      <Box>
                        <video src={typeof preview === 'string' ? preview : URL.createObjectURL(preview)} height="140" width="100%" controls />
                      </Box>
                    ) : (
                      <CardMedia
                        component="img"
                        height="140"
                        image={typeof preview === 'string' ? preview : URL.createObjectURL(preview)}
                        alt={typeof preview === 'string' ? '' : preview.name}
                      />
                    )}
                    <IconButton
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                      onClick={() => removePreview(index, field.value || [], field.onChange)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
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
