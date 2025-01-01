// // lib/export/exportManager.ts
// import { storage } from "@/src/firebaseConfig";
// import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
// import { db } from "@/src/db";
// import { VideoExports, Users, VideoData } from "@/src/db/schema";
// import { eq } from "drizzle-orm";
// import { ExportStatus } from "@/types";

// export class ExportManager {
//   static cleanupExport(id: number) {
//     throw new Error("Method not implemented.");
//   }
//   static async initiateExport(
//     videoId: number,
//     userId: string,
//     userEmail: string,
//     isPaid: boolean
//   ) {
//     const creditsRequired = isPaid ? 0 : 10;

//     return await db.transaction(async (tx) => {
//       // Check credits if user is not paid
//       if (!isPaid) {
//         const user = await tx
//           .select()
//           .from(Users)
//           .where(eq(Users.email, userEmail))
//           .then((res) => res[0]);

//         if (!user) {
//           throw new Error("User not found");
//         }

//         const currentCredits = user.credits || 0;
//         if (currentCredits < creditsRequired) {
//           throw new Error(`Insufficient credits (${currentCredits}/${creditsRequired})`);
//         }

//         // Deduct credits
//         await tx
//           .update(Users)
//           .set({ 
//             credits: currentCredits - creditsRequired,
//             updatedAt: new Date()
//           })
//           .where(eq(Users.email, userEmail));
//       }

//       // Create export record
//       const exportRecord = await tx
//         .insert(VideoExports)
//         .values({
//           videoId,
//           userId,
//           status: "pending" as ExportStatus,
//           creditsUsed: creditsRequired,
//           expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
//           createdAt: new Date(),
//         })
//         .returning({ id: VideoExports.id });

//       // Update video export count
//       await tx
//         .update(VideoData)
//         .set({
//           exportCount: db.sql`COALESCE(${VideoData.exportCount}, 0) + 1`,
//           lastExportedAt: new Date()
//         })
//         .where(eq(VideoData.id, videoId));

//       return exportRecord[0].id;
//     });
//   }

//   static async processExport(exportId: number, videoBuffer: Buffer, filename: string) {
//     const storageRef = ref(storage, `ai-short-video-files/${exportId}/${filename}`);
    
//     try {
//       await db
//         .update(VideoExports)
//         .set({ status: "processing" as ExportStatus })
//         .where(eq(VideoExports.id, exportId));

//       await uploadBytes(storageRef, videoBuffer, {
//         contentType: "video/mp4",
//         customMetadata: {
//           exportId: exportId.toString(),
//           createdAt: new Date().toISOString(),
//         },
//       });

//       const downloadUrl = await getDownloadURL(storageRef);

//       await db
//         .update(VideoExports)
//         .set({
//           status: "ready" as ExportStatus,
//           storageUrl: `ai-short-video-files/${exportId}/${filename}`,
//           downloadUrl,
//         })
//         .where(eq(VideoExports.id, exportId));

//       return downloadUrl;
//     } catch (error) {
//       await db
//         .update(VideoExports)
//         .set({ status: "error" as ExportStatus })
//         .where(eq(VideoExports.id, exportId));

//       throw error;
//     }
//   }