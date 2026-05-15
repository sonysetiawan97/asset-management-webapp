import type { FileUploadProps } from "@/types/FileUpload";
import { apiAxios } from "@/utils/apiAxios";
import type { FileProps } from "@/types/File";

const appendSingleFile = (formData: FormData, file: File) => {
  formData.append("file", file);
};

const appendMultipleFiles = (formData: FormData, files: File[]) => {
  for (const file of files) {
    formData.append("file[]", file);
  }
};

const useFileUpload = () => {
  const upload = async ({
    data,
    params,
  }: FileUploadProps): Promise<{ data: FileProps }> => {
    const formData = new FormData();
    const { files } = data;

    if (Array.isArray(files)) {
      appendMultipleFiles(formData, files);
    } else {
      appendSingleFile(formData, files);
    }

    try {
      const response = await apiAxios.post("/file/upload", formData, {
        params,
      });

      return response.data;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("File upload failed");
    }
  };

  return { upload };
};

export default useFileUpload;
