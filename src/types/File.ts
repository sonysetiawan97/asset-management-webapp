export interface FileProps {
  bucket: string;
  path: string;
  mime?: string;
  filename: string;
  originalFilename: string;
}

export interface FileDownloadProps {
  bucket: string;
  path: string;
  mime?: string
  filename: string;
  originalFilename: string;
}
