import { useFormContext, useWatch } from "react-hook-form";
import {
  ChangeEvent,
  useEffect,
  useState,
  type FC,
  type InputHTMLAttributes,
} from "react";
import { useSnackbar } from "notistack";
import LoadingSpinner from "@components/loadings/LoadingSpinner";
import useFileUpload from "@hooks/useFileUpload";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  bucket: string;
  path: string;
  required?: boolean;
  fieldInfo?: string;
  fileSizeAllowed?: number;
  fileTypeAllowed?: string;
  readOnly?: boolean;
}

const SingleSelectInput: FC<Props> = ({
  name,
  label,
  bucket = "single",
  path = "sagara",
  required = false,
  fieldInfo = "maximum file size is 1 MB and only PDF files are allowed",
  fileSizeAllowed = 1,
  fileTypeAllowed = "application/pdf",
  readOnly = false,
  ...rest
}) => {
  const {
    setValue,
    trigger,
    register,
    formState: { errors },
  } = useFormContext();

  const { upload } = useFileUpload();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const watchedValue = useWatch({ name });
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (watchedValue?.originalFilename) {
      setFileName(watchedValue.originalFilename);
    }
  }, [watchedValue]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = fileSizeAllowed * 1024 * 1024;
    const allowedTypes = fileTypeAllowed.split(",");

    if (file.size > MAX_SIZE) {
      e.target.value = "";
      enqueueSnackbar(
        `File size exceeds the maximum limit (${fileSizeAllowed} MB).`,
        { variant: "info" }
      );
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      e.target.value = "";
      enqueueSnackbar("Invalid file type.", {
        variant: "info",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await upload({
        data: { files: file },
        params: { bucket, path },
      });

      const uploaded = response.data;
      if (!uploaded) {
        e.target.value = "";
        enqueueSnackbar("File upload failed", {
          variant: "error",
        });
        return;
      }

      setValue(name, uploaded);
      trigger(name);
    } catch (error) {
      e.target.value = "";
      console.error("File upload failed:", error);
      enqueueSnackbar("File upload failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
          {fieldInfo && (
            <small className="text-muted d-block">{fieldInfo}</small>
          )}
        </label>
      )}
      <div className="position-relative">
        <input
          id={name}
          type="file"
          readOnly={readOnly}
          accept={fileTypeAllowed}
          className={`form-control ${errors[name] ? "is-invalid" : ""}`}
          onChange={handleFileChange}
          disabled={loading || readOnly}
          {...rest}
        />

        {fileName && (
          <div className="mt-2 small text-success">
            Uploaded: <strong>{fileName}</strong>
          </div>
        )}

        <input
          type="hidden"
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
        />

        <div
          className="position-absolute"
          style={{ top: "20px", right: "10px", transform: "translateY(-50%)" }}
        >
          {loading && <LoadingSpinner />}
        </div>
        {errors[name] && (
          <div className="invalid-feedback">
            {errors[name]?.message as string}
          </div>
        )}
      </div>
    </div>
  );
};

export { SingleSelectInput };
