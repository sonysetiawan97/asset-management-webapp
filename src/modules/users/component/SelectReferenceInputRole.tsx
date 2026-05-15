import { useEffect, useState, type FC } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  Controller,
  type Control,
  useWatch,
  useFormContext,
} from "react-hook-form";
import type { SingleValue, ActionMeta, GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import type { LoadOptions } from "react-select-async-paginate";

interface Props {
  name: string;
  control: Control;
  loadOptions: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  >;
  placeholder?: string;
  onChange?: (
    value: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  initialValue?: SelectOption | undefined;
}

const SelectReferenceInputRole: FC<Props> = ({
  name,
  control,
  loadOptions,
  placeholder = "Select...",
  onChange,
  label,
  required = false,
  readOnly = false,
  initialValue,
}) => {
  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useFormContext();
  const fieldValue = useWatch({ control, name }) as
    | SelectOption
    | string[]
    | null;

  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    initialValue ?? null
  );
  const [hasManuallySelected, setHasManuallySelected] = useState(false);

  useEffect(() => {
    if (!fieldValue || hasManuallySelected) return;

    let rawValue: string | null = null;
    let labelValue: string | null = null;

    if (Array.isArray(fieldValue)) {
      rawValue = fieldValue[0];
      labelValue = selectedOption?.label ?? rawValue;
    } else if (
      typeof fieldValue === "object" &&
      fieldValue !== null &&
      "value" in fieldValue &&
      "label" in fieldValue
    ) {
      rawValue = fieldValue.value != null ? String(fieldValue.value) : null;
      labelValue = fieldValue.label;
    }

    if (rawValue) {
      const newSelected = { value: rawValue, label: labelValue ?? rawValue };

      if (!selectedOption || selectedOption.value !== newSelected.value) {
        setSelectedOption(newSelected);
      }

      const currentForm = getValues(name);
      if (!Array.isArray(currentForm) || currentForm[0] !== newSelected.value) {
        setValue(name, [newSelected.value], { shouldDirty: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]);

  const handleChange = (
    selected: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>,
    onChangeField: (value: unknown) => void
  ) => {
    setSelectedOption(selected ?? null);
    setHasManuallySelected(true);

    const valueToSet = selected ? [selected.value] : [];
    onChangeField(valueToSet);

    onChange?.(selected, actionMeta);

    trigger(name);
  };

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
          required: required ? `${label} is required` : false,
        }}
        disabled={readOnly}
        render={({ field }) => (
          <AsyncPaginate
            value={selectedOption}
            loadOptions={loadOptions}
            additional={{ skip: 0 }}
            required={required}
            onChange={(selected, actionMeta) =>
              handleChange(selected, actionMeta, field.onChange)
            }
            placeholder={placeholder}
            isClearable
            isDisabled={readOnly}
            className={`react-select-async-paginate ${
              errors[name] ? "is-invalid" : ""
            }`}
            classNamePrefix="react-select-async-paginate"
            onBlur={() => field.onBlur()}
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

export default SelectReferenceInputRole;
