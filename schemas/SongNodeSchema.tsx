import { z } from "zod";

const SongNodeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  overallObjective: z.string().min(1, 'Overall Objective is required'),
  audioFile: z.union([z.instanceof(File), z.string()]).refine((val) => {
    if (val instanceof File) {
      return val.type.startsWith('audio/');
    }
    return true;
  }, 'Only audio files are allowed').refine((val) => !!val, 'Audio file is required'),
  albumCover: z.union([z.instanceof(File), z.string()]).refine((val) => {
    if (val instanceof File) {
      return val.type.startsWith('image/');
    }
    return true;
  }, 'Only image files are allowed').refine((val) => !!val, 'Album cover is required'),
  completionScore: z.number().min(0).max(100).optional()
});

export default SongNodeSchema;
