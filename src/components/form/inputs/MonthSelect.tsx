import type { FC } from "react";
import Select, { type SingleValue, type ActionMeta } from "react-select";
import { Controller, type Control } from "react-hook-form";
import type { SelectOption } from "@/types/SelectOption";

type Props = {
  name: string;
  control: Control;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (
    value: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
  label: string;
  required?: boolean;
  readOnly?: boolean;
};

const MonthInput: FC<Props> = ({
  name,
  control,
  options,
  placeholder = "Select...",
  onChange,
  label,
  required = false,
  readOnly = false,
}) => {
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
        disabled={readOnly}
        render={({ field }) => (
          <Select
            options={options}
            value={options.find((opt) => opt.value === field.value) || null}
            onChange={(selected, actionMeta) => {
              field.onChange(selected?.value ?? null);
              if (onChange) onChange(selected, actionMeta);
            }}
            placeholder={placeholder}
            isClearable
          />
        )}
      />
    </div>
  );
};

export default MonthInput;
