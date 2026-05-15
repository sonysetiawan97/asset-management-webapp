import { useFormContext } from "react-hook-form";
import type { FC, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  readOnly?: boolean;
  required?: boolean;
}

const Switch: FC<Props> = ({
  name,
  label,
  leftLabel,
  rightLabel,
  required = false,
  readOnly = false,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  return (
    <>
      <div className="mb-3 multiple-upload-file">
        {label && (
          <label htmlFor={name} className="form-label">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        )}
        <div className="d-flex gap-3 align-items-center">
          {leftLabel && <span>{leftLabel}</span>}
          <div className="form-check form-switch">
            <input
              {...register(name, {
                required: {
                  value: required,
                  message: `${name} value is required`,
                },
              })}
              id={name}
              type="checkbox"
              role="switch"
              aria-checked={watch(name) ?? false}
              className={`form-check-input ${errors[name] ? "is-invalid" : ""}`}
              readOnly={readOnly}
              {...rest}
            />
          </div>
          {rightLabel && <span>{rightLabel}</span>}
        </div>

        {errors[name] && (
          <div className="invalid-feedback">
            {errors[name]?.message as string}
          </div>
        )}
      </div>
    </>
  );
};

export { Switch };
