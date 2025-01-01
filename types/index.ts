// types/index.ts
export type ExportStatus = 'pending' | 'processing' | 'ready' | 'downloaded' | 'expired' | 'error';

export interface ExportProgress {
  status: ExportStatus;
  progress: number;
  message: string;
}