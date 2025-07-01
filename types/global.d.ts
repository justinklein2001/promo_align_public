import { Node }  from '@xyflow/react';
declare global {
    /**
     * NODE TYPES
     */
    type PromoNodeData = {
      id?: string,
      title: string,
      sceneObjective: string,
      parentSong: string,
      overallObjective?: string,
      type: string,
      recommendation: string,
      alignmentScore: number,
      sketches: (File | string)[],
    };
    
    type SongNodeData = {
      id?: string,
      title: string,
      audioFile: File | string,
      overallObjective: string,
      albumCover: File | string,
      completionScore?: number
    };
    
    type CustomNodeData = PromoNodeData | SongNodeData;
    type CustomNode = Node<CustomNodeData, 'promo' | 'song'>;

    type NodeData = {
        id: string;
        type: string;
        position: { x: number; y: number };
        data: PromoNodeData | SongNodeData;
        measured: { width: number; height: number };
        selected: boolean;
        dragging: boolean;
      };
  }
