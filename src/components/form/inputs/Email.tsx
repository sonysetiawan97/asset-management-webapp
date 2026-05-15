import { useFormContext } from "react-hook-form";
import type { FC, InputHTMLAttributes } from "react";

interface EmailProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
}

const Email: FC<EmailProps> = ({
  name,
  label,
  required = false,
  readOnly = false,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        readOnly={readOnly}
        {...register(name, {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
        })}
        id={name}
        type="email"
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        {...rest}
      />
      {errors[name] && (
        <div className="invalid-feedback">
          {errors[name]?.message as string}
        </div>
      )}
    </div>
  );
};

export { Email };
