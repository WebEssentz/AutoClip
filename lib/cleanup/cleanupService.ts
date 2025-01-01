// // lib/cleanup/cleanupService.ts
// import { db } from "@/src/db";
// import { VideoExports } from "@/src/db/schema";
// import { ExportManager } from "@/src/lib/export/exportManager";
// import { eq, lt } from "drizzle-orm";

// export class CleanupService {
//   static async cleanupExpiredExports() {
//     const now = new Date();

//     // Get all expired exports
//     const expiredExports = await db
//       .select()
//       .from(VideoExports)
//       .where(
//         lt(VideoExports.expiresAt, now)
//       );

//     // Clean up each expired export
//     for (const export_ of expiredExports) {
//       await ExportManager.cleanupExport(export_.id);
//     }
//   }

//   static scheduleCleanup() {
//     // Run cleanup every hour
//     setInterval(() => {
//       this.cleanupExpiredExports().catch(console.error);
//     }, 60 * 60 * 1000);
//   }
// }