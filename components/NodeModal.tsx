'use client'
import { Box, Button, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";

type NodeModalProps = {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    selectedNode: CustomNode | null;
    nodeType: 'promo' | 'song';
    songForm: UseFormReturn<SongNodeData>;
    promoForm: UseFormReturn<PromoNodeData>;
    onSubmit: () => void;
    nodes: CustomNode[];
  };
  
const NodeModal: React.FC<NodeModalProps> = ({ openDialog, setOpenDialog, selectedNode, nodeType, songForm, promoForm, onSubmit, nodes }) => {
    
    const handleDrop = (e: React.DragEvent, video: File[], onChange: (files: File[]) => void) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('video/') || file.type.startsWith('image/')
    );
    if (video) {
        const merged = [...video, ...files]
        onChange(merged);
        setVideoPreviews(merged);
    } else {
        onChange(files);
        setVideoPreviews(files);
    }
    };

    const [videoPreviews, setVideoPreviews] = useState<File[]>([]);

    return (
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedNode ? 'Edit' : 'Create'} {nodeType} Node</DialogTitle>
        <DialogContent>
          {nodeType === 'song' ? (
            <form onSubmit={songForm.handleSubmit(onSubmit)}>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Controller name="title" control={songForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Title" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}/>
                <Controller name="overallObjective" control={songForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Overall Objective" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}/>
                <Controller name="audioFile" control={songForm.control} render={({ field, fieldState }) => (
                  <TextField type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e?.target?.files?.[0])} label="Audio File"
                    error={!!fieldState.error} helperText={fieldState.error?.message} InputLabelProps={{ shrink: true }} />
                )}/>
                <Controller name="albumCover" control={songForm.control} render={({ field, fieldState }) => (
                  <TextField type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e?.target?.files?.[0])} label="Cover Image"
                    error={!!fieldState.error} helperText={fieldState.error?.message}  InputLabelProps={{ shrink: true }}/>
                )}/>
                <Button type="submit" variant="contained">Save</Button>
              </Stack>
            </form>
          ) : (
            <form onSubmit={promoForm.handleSubmit(onSubmit)}>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Controller name="title" control={promoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Title" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}/>
                <Controller name="sceneObjective" control={promoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} label="SceneObjective" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}/>
                <Controller name="parentSong" control={promoForm.control} render={({ field, fieldState }) => (
                  <FormControl error={!!fieldState.error}>
                    <InputLabel>Parent Node</InputLabel>
                    <Select {...field} label="Parent Node">
                      {nodes.filter(n => n.type === 'promo').map(n => (
                        <MenuItem key={n.id} value={n.id}>{n.data.title}</MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                  </FormControl>
                )}/>
                <Controller name="type" control={promoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Type" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}/>
                <Controller name="recommendation" control={promoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Recommendation" error={!!fieldState.error} helperText={fieldState.error?.message} />
                )}/>
                <Controller name="alignmentScore" control={promoForm.control} render={({ field, fieldState }) => (
                  <TextField {...field} type="number" label="Alignment Score" error={!!fieldState.error}
                    helperText={fieldState.error?.message} onChange={(e) => field.onChange(Number(e.target.value))} />
                )}/>
                <Controller name="sketches" control={promoForm.control} render={({ field, fieldState }) => (
                  <Box>
                    <Box
                      onDrop={(e) => handleDrop(e, field.value as File[], field.onChange)}
                      onDragOver={(e) => e.preventDefault()}
                      sx={{ p: 2, border: '2px dashed grey', borderRadius: 2, mb: 2, minHeight: '75px' }}
                      
                    >
                    <Typography>Drag and drop videos/images here</Typography>

                    </Box>
                    {fieldState.error && <Typography color="error">{fieldState.error.message}</Typography>}
                    <Stack direction="column" spacing={1} sx={{ mt: 2, maxHeight: '300px', overflowY: 'auto'}}>
                      {videoPreviews.map((preview, index) => (
                        <Box key={index} sx={{ position: "relative" }}>
                          {preview?.type?.includes('video/') ? (
                          <Box>
                            <video src={URL.createObjectURL(preview)} height="140" width="100%" controls />
                          </Box>
                          ) : (
                            <CardMedia
                            component="img"
                            height="140"
                            image={URL.createObjectURL(preview)}
                            alt={preview.name}
                          />
                          )}
                          <IconButton
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                            onClick={() => {
                              const newPreviews = videoPreviews.filter((_, i) => i !== index);
                              setVideoPreviews(newPreviews);
                              field.onChange(field.value.filter((_, i) => i !== index));
                            }}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}/>
                <Button type="submit" variant="contained">Save</Button>
              </Stack>
            </form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
};
export default NodeModal;