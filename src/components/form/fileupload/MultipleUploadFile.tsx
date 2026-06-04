import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { FC, InputHTMLAttributes, ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import useFileUpload from "@hooks/useFileUpload";
import { useSnackbar } from "notistack";
import type { FileProps } from "@/types/File";
import LoadingSpinner from "@components/loadings/LoadingSpinner";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  bucket: string;
  path: string;
  fileSizeAllowed?: number;
  fileTypeAllowed?: string;
  fieldInfo?: string;
  required?: boolean;
  readOnly?: boolean;
}

const MultipleUploadFile: FC<Props> = ({
  name,
  label,
  bucket = "multiple",
  path = "files",
  fileSizeAllowed = 1,
  fileTypeAllowed = "application/pdf",
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
  const { enqueueSnackbar } = useSnackbar();

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (uploadedValue.length > 0) {
      setFileNames(uploadedValue.map((file) => file.originalFilename));
      trigger(name);
    }
  }, [uploadedValue, name, trigger]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const MAX_SIZE_MB = fileSizeAllowed;
    const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

    const oversizedFiles = files.filter((file) => file.size > MAX_SIZE);
    const invalidFiles = files.filter((file) => file.type !== fileTypeAllowed);

    if (oversizedFiles.length > 0) {
      enqueueSnackbar(
        `File size exceeds the maximum limit (${MAX_SIZE_MB} MB).`,
        { variant: "info" }
      );
      return;
    }

    if (invalidFiles.length > 0) {
      enqueueSnackbar("Only PDF files are allowed", { variant: "info" });
      return;
    }

    setIsUploading(true);

    try {
      const response = await upload({
        data: { files },
        params: { bucket, path },
      });

      const uploaded = response.data;

      if (uploaded) {
        const newFiles = Array.isArray(uploaded) ? uploaded : [uploaded];
        const names = files.map((file) => file.name);

        setFileNames((prev) => [...prev, ...names]);
        const updatedValue = [...(watch(name) || []), ...newFiles];
        setValue(name, updatedValue, { shouldValidate: true });
      }
    } catch (error) {
      enqueueSnackbar(`Upload failed: ${error}`, { variant: "error" });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(fileNames[index]);

    const newFiles = [...fileNames];
    newFiles.splice(index, 1);
    setFileNames(newFiles);

    const newUploadedValue = [...uploadedValue];
    newUploadedValue.splice(index, 1);
    setValue(name, newUploadedValue, { shouldValidate: true });
  };

  return (
    <div className="mb-3 multiple-upload-file">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
          {fieldInfo && (
            <small className="text-muted d-block">{fieldInfo}</small>
          )}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        rules={{
          validate: () => uploadedValue.length > 0 || `${label} is required`,
        }}
        render={() => (
          <>
            <div className="">
              <input
                ref={inputRef}
                id={`uploadFile-${name}`}
                type="file"
                accept={fileTypeAllowed}
                multiple
                readOnly={readOnly}
                className={`form-control d-none ${
                  errors[name] ? "is-invalid" : ""
                }`}
                onChange={handleChange}
                disabled={isUploading}
                {...rest}
              />
              <label
                htmlFor={`uploadFile-${name}`}
                className="button-upload btn"
                style={{ width: "118px" }}
              >
                {isUploading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    Select file
                    <i className="bi bi-cloud-arrow-up"></i>
                  </>
                )}
              </label>

              <div className="d-flex gap-1 mt-2 flex-wrap">
                {fileNames.map((fileName, index) => (
                  <div
                    key={index + fileName}
                    className="badge bg-grey rounded-pill d-inline-flex align-items-center gap-2 text-dark"
                  >
                    {fileName}
                    <span
                      className="delete-attach"
                      onClick={() => handleRemoveFile(index)}
                      role="button"
                    >
                      <svg
                        height="16px"
                        viewBox="0 -960 960 960"
                        width="16px"
                        fill="#1f1f1f"
                      >
                        <title>remove</title>
                        <path d="M291-253.85 253.85-291l189-189-189-189L291-706.15l189 189 189-189L706.15-669l-189 189 189 189L669-253.85l-189-189-189 189Z" />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
              {errors[name] && (
                <div className="invalid-feedback">
                  {errors[name]?.message as string}
                </div>
              )}
            </div>
          </>
        )}
      />
    </div>
  );
};

export { MultipleUploadFile };
