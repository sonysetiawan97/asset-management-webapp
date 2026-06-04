import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { FC, InputHTMLAttributes, ChangeEvent } from "react";
import useFileUpload from "@hooks/useFileUpload";
import useFileDownload from "@hooks/useFileDownload";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import type { FileProps } from "@/types/File";
import LoadingSpinner from "@components/loadings/LoadingSpinner";

interface TextProps extends InputHTMLAttributes<HTMLInputElement> {
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

const SingleUploadImage: FC<TextProps> = ({
  name,
  label,
  bucket = "multiple",
  path = "sagara",
  fileSizeAllowed = 1,
  fileTypeAllowed = "application/pdf",
  fieldInfo = "maximum file size is 1 MB and only PDF files are allowed",
  required = false,
  readOnly = false,
  ...rest
}) => {
  const {
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useFormContext();

  const { upload } = useFileUpload();
  const { getFileBlob } = useFileDownload();
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const uploadedValue: FileProps = useWatch({ name });
  const { enqueueSnackbar } = useSnackbar();
  const allowedTypes = fileTypeAllowed.split(",");

  const inputId = `upload-${name}`;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!uploadedValue) {
      setPreviewUrl("");
      return;
    }
    let objectUrl: string;

    (async () => {
      const blob = await getFileBlob(uploadedValue);

      if (blob instanceof Blob) {
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      } else {
        console.warn("Expected Blob, but got:", blob);
      }
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedValue]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const MAX_SIZE = (fileSizeAllowed || 1) * 1024 * 1024;

      if (file.size > MAX_SIZE) {
        enqueueSnackbar(
          `File size exceeds the maximum limit (${fileSizeAllowed} MB).`,
          { variant: "info" }
        );
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        enqueueSnackbar("Only JPEG, PNG, or WebP images are allowed", {
          variant: "warning",
        });
        return;
      }

      setLoading(true);

      const response = await upload({
        data: { files: file },
        params: { bucket, path },
      });

      const uploaded = response.data;
      if (!uploaded) return;

      setValue(name, uploaded);
      trigger(name);
    } catch (error) {
      enqueueSnackbar(`Upload failed: ${error}`, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3 single-upload-img">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
          {fieldInfo && (
            <small className="text-muted d-block">{fieldInfo}</small>
          )}
        </label>
      )}
      <div className="upload pb-3">
        <Controller
          name={name}
          control={control}
          rules={{
            required: required ? `${label} is required` : false,
          }}
          render={() => (
            <>
              <input
                id={inputId}
                type="file"
                accept={fileTypeAllowed}
                readOnly={readOnly}
                className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                onChange={handleFileChange}
                {...rest}
              />
              <label
                htmlFor={inputId}
                className={previewUrl ? "edit-image" : ""}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : !previewUrl ? (
                  <i className="bi bi-cloud-arrow-up"></i>
                ) : (
                  <i className="bi bi-plus-lg"></i>
                )}
              </label>
                <div className="avatar-img">
                  {previewUrl && <img src={previewUrl} alt="preview" />}
                </div>
              {errors[name] && (
                <div className="invalid-feedback position-absolute bottom-0 text-nowrap ">
                  {errors[name]?.message as string}
                </div>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
};

export { SingleUploadImage };
