import { useFormContext } from "react-hook-form";
import type { FC, InputHTMLAttributes } from "react";

interface NumberInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

const NumberInput: FC<NumberInputProps> = ({
  name,
  label,
  min,
  max,
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
          min: {
            value: min ?? 0,
            message: `Minimum value is ${min ?? 0}`,
          },
          ...(max !== undefined && {
            max: {
              value: max,
              message: `Maximum value is ${max}`,
            },
          }),
          required: {
            value: required,
            message: `${label} value is Required`,
          },
        })}
        id={name}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        type="number"
        min={min}
        onWheel={(e) => e.currentTarget.blur()}
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

export { NumberInput };
