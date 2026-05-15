import { apiAxios } from "@/utils/apiAxios";
import type { FileDownloadProps } from "@/types/File";
import { useState } from "react";

const useFileDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getFileBlob = async ({
    bucket,
    path,
    filename,
    originalFilename,
  }: FileDownloadProps): Promise<Blob | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get("/file/download", {
        params: { bucket, path, filename, originalFilename },
        responseType: "blob",
      });

      return response.data;
    } catch (err) {
      setError(err as Error);
      console.error("File download failed", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getFileBlob,
    loading,
    error,
  };
};

export default useFileDownload;
