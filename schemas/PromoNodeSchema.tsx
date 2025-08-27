import { z } from "zod";

const PromoNodeSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    sceneObjective: z.string().min(1, 'Scene Objective is required'),
    parentSong: z.string().min(1, 'Related song required.'),
    overallObjective: z.string().optional(),
    type: z.string().min(1, 'Type is required'),
    recommendation: z.string(),
    alignmentScore: z.number().min(0).max(100),
    sketches: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, 'At least one file is required')
    .refine(
      (items) =>
        items.every((item) => {
          if (item instanceof File) {
            return ['image/', 'video/'].some((type) => item.type.startsWith(type));
          }
          return true;
        }),
      'Only image and video files are allowed'
    ),
  });

export default PromoNodeSchema;
