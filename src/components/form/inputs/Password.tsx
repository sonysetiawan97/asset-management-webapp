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
            <svg
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#959595"
            >
              <path d="M623.92-438.08 575-487q4-40.69-24.35-66.85Q522.31-580 487-576l-48.92-48.92q9.54-3.08 20.27-4.62t21.65-1.54q63.08 0 107.08 44t44 107.08q0 10.92-1.54 22.04-1.54 11.11-5.62 19.88Zm132.23 131.46L718-344q36-28 65.5-61.5T833-480q-49-101-144.5-158.5T480-696q-26 0-51 3t-49 10l-42.61-42.61q34.92-13.08 70.96-17.73Q444.39-748 480-748q132.61 0 246.11 71.54T890.46-480q-21.23 51.61-55.42 94.08-34.2 42.46-78.89 79.3Zm10.31 187.39L642.62-243.85q-33.77 14.39-75.2 23.12Q526-212 480-212q-133 0-246.11-71.54Q120.77-355.08 69.54-480q23.15-57 62.23-104.38 39.08-47.39 88.23-83.08l-100.77-100 37.16-37.15 647.22 648.22-37.15 37.16Zm-509.3-510.08q-37.7 27.23-73.66 65.16Q147.54-526.23 127-480q49 101 144.5 158.5T480-264q33.31 0 66.39-5.62 33.07-5.61 56.92-13.53L543.69-342q-13.23 6.15-30.69 9.61-17.46 3.47-33 3.47-63.08 0-107.08-44t-44-107.08q0-15.15 4.47-32.42 4.46-17.27 8.61-31.27l-84.84-85.62Z" />
            </svg>
          ) : (
            // 👁️ Show Icon
            <svg
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#959595"
            >
              <path d="M480.09-328.92q62.99 0 106.99-44.09 44-44.09 44-107.08 0-62.99-44.09-106.99-44.09-44-107.08-44-62.99 0-106.99 44.09-44 44.09-44 107.08 0 62.99 44.09 106.99 44.09 44 107.08 44ZM480-384q-40 0-68-28t-28-68q0-40 28-68t68-28q40 0 68 28t28 68q0 40-28 68t-68 28Zm.05 172q-134.57 0-245.23-73.12Q124.16-358.23 69.54-480q54.62-121.77 165.22-194.88Q345.37-748 479.95-748q134.57 0 245.23 73.12Q835.84-601.77 890.46-480q-54.62 121.77-165.22 194.88Q614.63-212 480.05-212ZM480-480Zm0 216q112 0 207-58t146-158q-51-100-146-158t-207-58q-112 0-207 58T127-480q51 100 146 158t207 58Z" />
            </svg>
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
