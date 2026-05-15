import { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneNumberInputProps {
  name: string;
  label?: string;
  required?: boolean;
  readOnly?: boolean;
  defaultCountry?: string;
}

const PhoneNumberInput: FC<PhoneNumberInputProps> = ({
  name,
  label,
  required = false,
  readOnly = false,
  defaultCountry = "id",
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col gap-2 mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? "Phone number is required" : false,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PhoneInput
            country={defaultCountry}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            inputStyle={{
              width: "100%",
              height: "38px",
              borderRadius: "8px 0 0 0",
              fontSize: "14px",
            }}
            inputProps={{
              required,
              readOnly,
            }}
            enableSearch={true}
            disableSearchIcon={false}
            specialLabel=""
            containerClass={`react-phone-input-2 ${
              errors[name] ? "is-invalid" : ""
            }`}
          />
        )}
      />

      {errors[name] && (
        <div className="invalid-feedback d-block">
          {errors[name]?.message as string}
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInput;
