import { useEffect, useState, type FC } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  Controller,
  useWatch,
  useFormContext,
} from "react-hook-form";
import type { SingleValue, ActionMeta, GroupBase } from "react-select";
import type { SelectOption } from "@/types/SelectOption";
import type { LoadOptions } from "react-select-async-paginate";

interface Props {
  name: string;
  control: any;
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
  isOptionDisabled?: (option: SelectOption) => boolean;
}

const SelectReferenceInput: FC<Props> = ({
  name,
  control,
  loadOptions,
  placeholder = "Select...",
  onChange,
  label,
  required = false,
  readOnly = false,
  initialValue,
  isOptionDisabled,
}) => {
  const {
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext();
  const fieldValue = useWatch({ control, name }) as
    | SelectOption
    | string
    | null;

  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    initialValue ?? null
  );

  useEffect(() => {
    if (!fieldValue) {
      setSelectedOption(null);
      return;
    }

    if (selectedOption?.value !== fieldValue) {
      setSelectedOption(
        typeof fieldValue === "object"
          ? fieldValue
          : { value: fieldValue, label: String(fieldValue) }
      );
    }

    if (fieldValue && typeof fieldValue === "object" && "value" in fieldValue) {
      setValue(name, fieldValue.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]);

  const handleChange = (
    selected: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>,
    onChangeField: (value: unknown) => void
  ) => {
    setSelectedOption(selected ?? null);
    onChangeField(selected?.value ?? null);
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
            isOptionDisabled={isOptionDisabled}
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

export default SelectReferenceInput;
