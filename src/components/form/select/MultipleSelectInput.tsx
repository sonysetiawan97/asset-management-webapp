import { useEffect, type FC } from "react";
import { GroupBase, type ActionMeta, type MultiValue } from "react-select";
import { Controller, useFormContext, type Control } from "react-hook-form";
import type { SelectOption } from "@/types/SelectOption";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";

type Props = {
  name: string;
  control: Control;
  placeholder?: string;
  onChange?: (
    value: MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  loadOptions: LoadOptions<
    SelectOption,
    GroupBase<SelectOption>,
    { skip: number }
  >;
  initialValue?: SelectOption[] | undefined;
};

const MultipleSelectInput: FC<Props> = ({
  name,
  control,
  placeholder = "Select...",
  onChange,
  label,
  required = false,
  readOnly = false,
  loadOptions,
  initialValue = [],
}) => {
  const {
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (initialValue && initialValue.length > 0) {
      setValue(name, initialValue);
    }
  }, [initialValue, name, setValue]);

  const handleChange = (
    selected: MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>,
    onChangeField: (value: unknown) => void
  ) => {
    onChangeField(selected);
    onChange?.(selected, actionMeta);
    trigger(name);
  };

  return (
    <div className="mb-3 multiple-select">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        disabled={readOnly}
        rules={{
          required: required ? `${label} is required` : false,
        }}
        render={({ field }) => {
          const safeValue = Array.isArray(field.value)
            ? field.value.filter(
                (item) =>
                  item && item.value !== undefined && item.label !== undefined
              )
            : [];

          return (
            <AsyncPaginate
              isMulti
              value={safeValue}
              loadOptions={loadOptions}
              required={required}
              backspaceRemovesValue={true}
              onChange={(selected, actionMeta) =>
                handleChange(selected, actionMeta, field.onChange)
              }
              additional={{ skip: 0 }}
              placeholder={placeholder}
              closeMenuOnSelect={false}
              isDisabled={readOnly}
              isClearable
              className={`react-select-async-paginate ${
                errors[name] ? "is-invalid" : ""
              }`}
              classNamePrefix="react-select-async-paginate"
              onBlur={() => field.onBlur()}
            />
          );
        }}
      />
      {errors[name] && (
        <div className="invalid-feedback">
          {errors[name]?.message as string}
        </div>
      )}
    </div>
  );
};

export default MultipleSelectInput;
