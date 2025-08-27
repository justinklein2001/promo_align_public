import { db, songNodes, promoNodes, edges } from "@/db";
import { eq, or } from "drizzle-orm";

export class NodeService {
  static async getAllNodes() {
    try {
      const [songs, promos] = await Promise.all([
        db.select().from(songNodes),
        db.select().from(promoNodes)
      ]);

      const allNodes = [
        ...songs.map(song => song.node),
        ...promos.map(promo => promo.node)
      ];

      return allNodes;
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      throw new Error("Failed to fetch nodes");
    }
  }

  static async getAllEdges() {
    try {
      const result = await db.select().from(edges);
      return result.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default'
      }));
    } catch (error) {
      console.error("Failed to fetch edges:", error);
      throw new Error("Failed to fetch edges");
    }
  }

  static async updateNodePositions(nodes: CustomNode[]) {
    try {
      for (const node of nodes) {
        if (node.type === 'song') {
          await db.update(songNodes)
            .set({ node: node })
            .where(eq(songNodes.id, node.id));
        } else if (node.type === 'promo') {
          await db.update(promoNodes)
            .set({ node: node })
            .where(eq(promoNodes.id, node.id));
        }
      }
    } catch (error) {
      console.error("Failed to update node positions:", error);
      throw new Error("Failed to update node positions");
    }
  }

  static async deleteNode(nodeId: string, nodeType: string) {
    try {
      // Delete associated edges first
      await db.delete(edges).where(
        or(
          eq(edges.source, nodeId),
          eq(edges.target, nodeId)
        )
      );

      // Delete the node
      if (nodeType === 'song') {
        await db.delete(songNodes).where(eq(songNodes.id, nodeId));
      } else if (nodeType === 'promo') {
        await db.delete(promoNodes).where(eq(promoNodes.id, nodeId));
      }
    } catch (error) {
      console.error("Failed to delete node:", error);
      throw new Error("Failed to delete node");
    }
  }

  static async saveEdges(edgeList: any[]) {
    try {
      // Clear existing edges and insert new ones
      await db.delete(edges);
      
      if (edgeList.length > 0) {
        await db.insert(edges).values(
          edgeList.map(edge => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || 'default'
          }))
        );
      }
    } catch (error) {
      console.error("Failed to save edges:", error);
      throw new Error("Failed to save edges");
    }
  }
}
