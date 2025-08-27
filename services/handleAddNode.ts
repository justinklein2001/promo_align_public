// services/nodeService.ts
import { writeFile } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { promoNodes, songNodes, edges } from "@/db/schema";
import { v4 as uuidv4 } from 'uuid';

function createUploadPath(filename: string): string {
  return path.join(process.cwd(), "public/uploads", filename);
}

async function saveFile(file: File): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const filePath = createUploadPath(filename);
    await writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save file");
  }
}

export async function handlePromoNode(formData: FormData) {
  try {
    const node = formData.get("node") as string; // JSON string
    const sketchesFiles = formData.getAll("sketches[]") as File[];

    const sketches = await Promise.all(
      sketchesFiles.map(async (file) => await saveFile(file))
    );
    const parsedNode = JSON.parse(node);
    parsedNode.data.sketches = sketches;
    const id = parsedNode.id;
    
    await db.insert(promoNodes).values({
      id, 
      node: parsedNode
    }).onConflictDoUpdate({
      target: promoNodes.id,
      set: { node: parsedNode }
    });

    // Create edge between parent song and promo node
    if (parsedNode.data.parentSong) {
      const edgeId = uuidv4();
      await db.insert(edges).values({
        id: edgeId,
        source: parsedNode.data.parentSong,
        target: id,
        type: 'default'
      }).onConflictDoNothing();
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to handle promo node:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      throw new Error("A promo node with this ID already exists.");
    }

    throw new Error("Could not create promo node. Please try again.");
  }
}

export async function handleSongNode(formData: FormData) {
  try {
    const node = formData.get("node") as string; // JSON string
    const audioFile = formData.get("audioFile") as File;
    const albumCover = formData.get("albumCover") as File;

    const parsedNode = JSON.parse(node);
    const audioFilePath = await saveFile(audioFile);
    const coverFilePath = await saveFile(albumCover);

    parsedNode.data.albumCover = coverFilePath;
    parsedNode.data.audioFile = audioFilePath;
    const id = parsedNode.id as string;

    await db.insert(songNodes).values({
      id: id,
      node: parsedNode
    }).onConflictDoUpdate({
      target: songNodes.id,
      set: { node: parsedNode }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to handle song node:", error);

    if (error instanceof Error && error.message.includes("duplicate key")) {
      throw new Error("A song node with this ID already exists.");
    }

    throw new Error("Could not create song node. Please try again.");
  }
}
