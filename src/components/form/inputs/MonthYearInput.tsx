import { Controller, useFormContext } from "react-hook-form";
import type { FC, InputHTMLAttributes } from "react";
import { useRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
}

const MonthYearInput: FC<Props> = ({
  name,
  label,
  required = false,
  readOnly = false,
  ...rest
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const triggerDate = () => {
    if (!readOnly) {
      if (inputRef.current?.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div onClick={triggerDate}>
        <Controller
          control={control}
          name={name}
          rules={{
            required: required ? "Month and year is required" : false,
          }}
          render={({ field }) => (
            <input
              {...field}
              type="month"
              id={name}
              ref={(e) => {
                field.ref(e);
                inputRef.current = e;
              }}
              className={`form-control ${errors[name] ? "is-invalid" : ""}`}
              readOnly={readOnly}
              value={field.value ?? ""}
              onBlur={() => field.onBlur()}
              {...rest}
            />
          )}
        />
        {errors[name] && (
          <div className="invalid-feedback d-block">
            {errors[name]?.message as string}
          </div>
        )}
      </div>
    </div>
  );
};

export { MonthYearInput };
