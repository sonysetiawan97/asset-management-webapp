import { RegisterOptions, useFormContext } from "react-hook-form";
import { useState } from "react";
import type { FC, InputHTMLAttributes } from "react";

interface PasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
  validate?: (value: string) => string | boolean;
  validation?: RegisterOptions;
}

const Password: FC<PasswordProps> = ({
  name,
  label,
  required = false,
  readOnly = false,
  validate,
  validation,
  ...rest
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=,./]).{8,}$/;
  const passwordErrorMessage =
    "Password must be at least 6 characters and include an uppercase letter, a lowercase letter, a number, and a symbol";

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="input-group form-password">
        <input
          readOnly={readOnly}
          {...rest}
          {...register(
            name,
            validation
              ? validation
              : {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: passwordPattern,
                    message: passwordErrorMessage,
                  },
                  validate,
                }
          )}
          id={name}
          type={showPassword ? "text" : "password"}
          className={`form-control ${errors[name] ? "is-invalid" : ""}`}
        />
        <button
          type="button"
          className="btn border rounded-end"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            // 👁️ Hide Icon
            <i className="bi bi-eye-slash"></i>
          ) : (
            // 👁️ Show Icon
            <i className="bi bi-eye"></i>
          )}
        </button>
        {errors[name] && (
          <div className="invalid-feedback">
            {errors[name]?.message as string}
          </div>
        )}
      </div>
    </div>
  );
};

export { Password };
