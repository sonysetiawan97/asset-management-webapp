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
                  <svg
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#959595"
                  >
                    <title>Upload</title>
                    <path d="M460-336.92v-346l-93.23 93.23-28.31-28.77L480-760l141.54 141.54-28.31 28.77L500-682.92v346h-40ZM264.62-200q-27.62 0-46.12-18.5Q200-237 200-264.62v-96.92h40v96.92q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h430.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-96.92h40v96.92q0 27.62-18.5 46.12Q723-200 695.38-200H264.62Z" />
                  </svg>
                ) : (
                  <svg
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#959595"
                  >
                    <title>Replace image</title>
                    <path d="M224.62-160q-27.62 0-46.12-18.5Q160-197 160-224.62v-510.76q0-27.62 18.5-46.12Q197-800 224.62-800h335.46l-40 40H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v510.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h510.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-299.53l40-40v339.53q0 27.62-18.5 46.12Q763-160 735.38-160H224.62ZM480-480Zm-80 80v-104.62l357.77-357.76q6.61-6.62 13.92-9.16t15.39-2.54q7.54 0 14.73 2.54t13.04 8.39L859.31-820q6.38 6.62 9.69 14.58 3.31 7.96 3.31 16.04 0 8.07-2.43 15.26-2.42 7.2-9.03 13.81L500.77-400H400Zm432.54-388.62-44.46-46.76 44.46 46.76ZM440-440h43.69l266.62-266.62-21.85-21.84-24.38-23.39L440-487.77V-440Zm288.46-288.46-24.38-23.39 24.38 23.39 21.85 21.84-21.85-21.84Z" />
                  </svg>
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
