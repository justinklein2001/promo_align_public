'use client'
import { Box } from "@mui/material";

const MediaPreview: React.FC<{ file: File }> = ({ file }) => {
    console.log(file)
    if (file.type.startsWith("image/")) { 
      return (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            pt: "56.25%",
            my: 1,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={
                URL.createObjectURL(file) ||
              "https://via.placeholder.com/300x200?text=Image+Preview"
            }
            alt={file.name}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </Box>
      );
    } else if (file.type.startsWith("video/")) {
      return (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            pt: "56.25%",
            my: 1,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <video
              src={URL.createObjectURL(file) || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
              width="100%"
              height="100%"
              controls
            />
          </Box>
        </Box>
      );
    }
  
  };

export default MediaPreview;