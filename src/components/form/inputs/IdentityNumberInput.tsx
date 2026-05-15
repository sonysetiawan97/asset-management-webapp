import { useFormContext } from "react-hook-form";
import type { FC, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
}

const IdentityNumberInput: FC<Props> = ({
  name,
  label,
  required = false,
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
        {...register(name, {
          required: {
            value: required,
            message: `${label} value is required`,
          },
          pattern: {
            value: /^[0-9]{16}$/,
            message: "Must be exactly 16 digits",
          },
        })}
        id={name}
        maxLength={16}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        inputMode="numeric"
        onInput={(e) => {
          const input = e.target as HTMLInputElement;
          input.value = input.value.replace(/[^0-9]/g, ""); // remove non-digits
        }}
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

export { IdentityNumberInput };
