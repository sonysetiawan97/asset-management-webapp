import { useFormContext } from "react-hook-form";
import type { FC, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
}

const TextAreaInput: FC<Props> = ({ name, label, required = false }) => {
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
      <textarea
        {...register(name, {
          required: {
            value: required,
            message: `${label} value is Required`,
          },
        })}
        className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        placeholder="Text here"
        id={name}
        // {...rest}
        style={{ height: "100px" }}
      ></textarea>
      {errors[name] && (
        <div className="invalid-feedback">
          {errors[name]?.message as string}
        </div>
      )}
    </div>
  );
};

export { TextAreaInput };
