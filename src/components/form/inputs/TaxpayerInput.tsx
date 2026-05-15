import { Controller, useFormContext } from "react-hook-form";
import type { FC, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
}

const formatNPWP = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 15);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 8),
    digits.slice(8, 9),
    digits.slice(9, 12),
    digits.slice(12, 15),
  ];
  return parts
    .map((p, i) => {
      if (!p) return "";
      if (i === 0) return p;
      if (i === 3) return `-${p}`;
      return `.${p}`;
    })
    .join("");
};

const NPWP_REGEX = /^[\d.-]+$/;

const InputTaxpayer: FC<Props> = ({
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

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          required: {
            value: required,
            message: `${label ?? name} is required`,
          },
          pattern: {
            value: NPWP_REGEX,
            message: "Format NPWP tidak valid (contoh: 12.345.678.9-012.345)",
          },
        }}
        render={({ field }) => (
          <input
            {...field}
            id={name}
            inputMode="numeric"
            autoComplete="off"
            readOnly={readOnly}
            value={formatNPWP(field.value || "")}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "").slice(0, 15);
              field.onChange(raw);
            }}
            className={`form-control ${errors[name] ? "is-invalid" : ""}`}
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
  );
};

export { InputTaxpayer };
