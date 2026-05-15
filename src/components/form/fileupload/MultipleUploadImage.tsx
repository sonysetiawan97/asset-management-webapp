import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { FC, InputHTMLAttributes, ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import useFileUpload from "@hooks/useFileUpload";
import useFileDownload from "@hooks/useFileDownload";
import { useSnackbar } from "notistack";
import type { FileProps } from "@/types/File";
import LoadingSpinner from "@components/loadings/LoadingSpinner";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  bucket: string;
  path: string;
  fileSizeAllowed?: number;
  fileTypeAllowed?: string[];
  fieldInfo?: string;
  required?: boolean;
  readOnly?: boolean;
}

const MultipleUploadImage: FC<Props> = ({
  name,
  label,
  bucket = "multiple",
  path = "sagara",
  fileSizeAllowed = 1,
  fileTypeAllowed = ["image/jpeg", "image/png", "image/webp"],
  fieldInfo = "maximum file size is 1 MB and only PDF files are allowed",
  required = false,
  readOnly = false,
  ...rest
}) => {
  const {
    setValue,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uploadedValue: FileProps[] = useWatch({ control, name }) || [];

  useEffect(() => {
    if ((uploadedValue || []).length > 0) {
      trigger(name);
    }
  }, [uploadedValue, name, trigger]);

  const { upload } = useFileUpload();
  const { getFileBlob } = useFileDownload();
  const { enqueueSnackbar } = useSnackbar();

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const initPreviewUrls = async () => {
      if (uploadedValue.length > 0 && previewUrls.length === 0) {
        const blobs = await Promise.all(
          uploadedValue.map((file) => getFileBlob(file))
        );
        const urls = blobs.map((blob) =>
          blob instanceof Blob ? URL.createObjectURL(blob) : ""
        );
        setPreviewUrls(urls);
      }
    };

    initPreviewUrls();
  }, [uploadedValue, previewUrls.length, getFileBlob]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    const MAX_SIZE_MB = fileSizeAllowed;
    const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

    const oversizedFiles = files.filter((file) => file.size > MAX_SIZE);
    const validFiles = files.filter((file) =>
      fileTypeAllowed.includes(file.type)
    );
    const invalidFiles = files.filter(
      (file) => !fileTypeAllowed.includes(file.type)
    );

    if (oversizedFiles.length > 0) {
      enqueueSnackbar(
        `File size exceeds the maximum limit (${MAX_SIZE_MB} MB).`,
        {
          variant: "info",
        }
      );
      return;
    }

    if (invalidFiles.length > 0) {
      enqueueSnackbar("Only JPEG, PNG, or WebP images are allowed", {
        variant: "info",
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await upload({
        data: { files: validFiles },
        params: { bucket, path },
      });

      const uploaded = response.data;

      if (uploaded) {
        const newFiles = Array.isArray(uploaded) ? uploaded : [uploaded];
        const newBlobs = await Promise.all(
          newFiles.map((file) => getFileBlob(file))
        );
        const newPreviews = newBlobs.map((blob) =>
          blob instanceof Blob ? URL.createObjectURL(blob) : ""
        );

        setPreviewUrls((prev) => [...prev, ...newPreviews]);
        const updatedValue = [...(watch(name) || []), ...newFiles];
        setValue(name, updatedValue, {
          shouldValidate: true,
        });
      }
    } catch (error) {
      enqueueSnackbar(`Upload failed: ${error}`, {
        variant: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    const newUploadedValue = [...uploadedValue];
    newUploadedValue.splice(index, 1);
    setValue(name, newUploadedValue, { shouldValidate: true });
  };

  return (
    <div className="mb-3 multiple-upload-img">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
          {fieldInfo && (
            <small className="text-muted d-block">{fieldInfo}</small>
          )}
        </label>
      )}
      <div className="upload pb-3 d-flex">
        <div className="d-flex align-items-center flex-wrap gap-2">
          {previewUrls.map((url, idx) => (
            <div key={url} className="avatar-img position-relative">
              <span className="delete-image" onClick={() => handleDelete(idx)}>
                <svg
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#1f1f1f"
                >
                  <path d="M336.62-184q-23.55 0-40.09-16.53Q280-217.07 280-240.62V-696h-48v-32h152v-38.77h192V-728h152v32h-48v454.95Q680-216 663.85-200q-16.15 16-40.47 16H336.62ZM648-696H312v455.38q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h286.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93V-696ZM416.31-288h32v-336h-32v336Zm95.38 0h32v-336h-32v336ZM312-696v480-480Z" />
                </svg>
              </span>
              <img src={url} alt={`preview-${idx}`} />
            </div>
          ))}
          <Controller
            control={control}
            name={name}
            rules={{
              validate: () => uploadedValue.length > 0 || `${label} is required`,
            }}
            render={() => (
              <>
                <input
                  ref={inputRef}
                  id={`uploadImage-${name}`}
                  type="file"
                  accept={fileTypeAllowed.join(",")}
                  multiple
                  className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                  onChange={handleChange}
                  disabled={isUploading || readOnly}
                  {...rest}
                />
                <label
                  htmlFor={`uploadImage-${name}`}
                  className="d-flex justify-content-center align-items-center"
                >
                  {isUploading ? (
                    <LoadingSpinner />
                  ) : (
                    <svg
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#959595"
                    >
                      <title>upload</title>
                      <path d="M460-336.92v-346l-93.23 93.23-28.31-28.77L480-760l141.54 141.54-28.31 28.77L500-682.92v346h-40ZM264.62-200q-27.62 0-46.12-18.5Q200-237 200-264.62v-96.92h40v96.92q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h430.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-96.92h40v96.92q0 27.62-18.5 46.12Q723-200 695.38-200H264.62Z" />
                    </svg>
                  )}
                </label>
                {errors[name] && (
                  <div className="invalid-feedback position-absolute bottom-0">
                    {errors[name]?.message as string}
                  </div>
                )}
              </>
            )}
          />
        </div>

      </div>
    </div>
  );
};

export { MultipleUploadImage };
