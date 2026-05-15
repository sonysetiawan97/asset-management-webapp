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
                    <svg
                      height="20px"
                      viewBox="0 -960 960 960"
                      width="20px"
                      fill="#1f1f1f"
                    >
                      <title>upload</title>
                      <path d="M606.92-496.31v-208.3h52v208.3h-52ZM428.15-264.16q-23.53-8.38-37.76-30.07-14.23-21.7-14.23-49.23v-361.15h51.99v440.45ZM460.21-116q-84.44 0-141.94-60.9-57.5-60.89-57.5-146.33v-378.62q0-59.23 41.08-100.69Q342.92-844 402.15-844q60.23 0 100.81 43.96 40.58 43.96 40.58 105.19V-396h-52v-306.23q.38-37.31-25.78-63.54Q439.6-792 401.96-792q-37.46 0-63.33 27.42-25.86 27.43-25.86 64.73v383.62q.38 61.54 43.15 104.38Q398.69-169 460.23-168q30.61 1 57.36-12.23t45.64-34.69v70.69q-22.85 14-49.08 21.11-26.24 7.12-53.94 7.12Zm182.71-48v-100.31h-100.3v-52h100.3v-100.3h52v100.3h100.31v52H694.92V-164h-52Z" />
                    </svg>
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
