import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';

const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

interface CustomNodeProps extends NodeProps {
  onDelete?: () => void;
  showDelete?: boolean;
}

const NodeComponent: React.FC<CustomNodeProps> = ({ data, type, onDelete, showDelete = false }) => {
  const isPromo = type === 'promo';
  const nodeData = data as any; // Type assertion for now
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        minWidth: 200, 
        backgroundColor: isPromo ? '#e3f2fd' : '#f3e5f5',
        border: `2px solid ${isPromo ? '#2196f3' : '#9c27b0'}`,
        position: 'relative'
      }}
    >
      {showDelete && onDelete && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            }
          }}
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      )}
      {!isPromo && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#9c27b0' }}
        />
      )}
      
      {isPromo && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#2196f3' }}
        />
      )}
      
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          {nodeData.title || 'Untitled'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {isPromo ? 'Promo Node' : 'Song Node'}
        </Typography>
        
        <Typography variant="body2" sx={{ mb: 1 }}>
          {nodeData.overallObjective || nodeData.sceneObjective || ''}
        </Typography>
        
        {isPromo && (
          <>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Type: {nodeData.type || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Score: {nodeData.alignmentScore || 0}%
            </Typography>
            {nodeData.sketches && Array.isArray(nodeData.sketches) && (
              <Typography variant="body2">
                Files: {nodeData.sketches.length}
              </Typography>
            )}
          </>
        )}
        
        {!isPromo && nodeData.completionScore && (
          <Typography variant="body2">
            Completion: {nodeData.completionScore}%
          </Typography>
        )}
        {nodeData.albumCover && !isPromo && (
          <Box sx={{ mt: 1 }}>
            <Image height={200} width={200} src={nodeData.albumCover} alt="Album Cover" style={{ maxHeight: '50px', width: 'auto' }} unoptimized/>
          </Box>
        )}
        {isPromo && nodeData.sketches && nodeData.sketches.length > 0 && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap' }}>
            {nodeData.sketches.map((sketch: string, index: number) => (
              !isVideo(sketch) && (
                <Image height={200} width={200} key={index} src={sketch} alt={`Sketch ${index + 1}`} style={{ maxHeight: '50px', margin: '5px' }} unoptimized/>
              )
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default NodeComponent;
