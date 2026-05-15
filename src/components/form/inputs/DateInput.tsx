import { Controller, useFormContext } from "react-hook-form";
import type { FC, InputHTMLAttributes } from "react";
import { useRef } from "react";

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  readOnly?: boolean;
  required?: boolean;
}

const DateInput: FC<DateInputProps> = ({
  name,
  label,
  required = false,
  readOnly = false,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const triggerDatePicker = () => {
    if (!readOnly) {
      if (inputRef.current?.showPicker) {
        inputRef.current.showPicker();
      } else {
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div className="mb-3 date-input">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="d-flex flex-column" onClick={triggerDatePicker}>
        <Controller
          control={control}
          name={name}
          rules={{
            required: required ? "Date is required" : false,
          }}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type="date"
              ref={(e) => {
                field.ref(e);
                inputRef.current = e;
              }}
              className={`form-control ${errors[name] ? "is-invalid" : ""}`}
              readOnly={readOnly}
              value={field.value ?? ""}
              onBlur={() => {
                field.onBlur();
              }}
              {...rest}
            />
          )}
        />
        {errors[name] && (
          <div className="invalid-feedback">
            {errors[name]?.message as string}
          </div>
        )}
      </div>
    </div>
  );
};

export { DateInput };
