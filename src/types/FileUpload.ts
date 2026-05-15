export interface FileUploadProps {
  data: {
    files: File | File[];
  };
  params: {
    bucket: string;
    path: string;
  };
}
