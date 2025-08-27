'use client'
import { Box } from '@mui/material';
import { Handle, Position } from '@xyflow/react';


const PromoDisplay = ({data}: any) => {
    return (
        <Box sx={{
            bgcolor: 'white',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            p:  2,
            width: { xs: 200, sm: 250 },
            minHeight: 100,
            position: 'relative',
            }}>
            <Handle type="source" position={Position.Bottom} id={data.id} />
        </Box>
    );
}

export default PromoDisplay;