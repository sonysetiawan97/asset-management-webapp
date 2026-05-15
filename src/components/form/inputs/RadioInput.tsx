import { useFormContext } from "react-hook-form";
import { useEffect, type InputHTMLAttributes } from "react";
import { ListOption } from "@/types/ListOption";

interface Props<Value, Label extends React.ReactNode = React.ReactNode>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "defaultValue"
  > {
  name: string;
  label?: string;
  data: ListOption<Value, Label>[];
  required?: boolean;
  defaultValue?: Value;
  onChange?: (
    selectedValue: Value,
    selectedItems?: ListOption<Value, Label>
  ) => void;
}

const RadioInput = <Value, Label extends React.ReactNode = React.ReactNode>({
  name,
  label,
  data,
  defaultValue,
  required = false,
  onChange,
  ...rest
}: Props<Value, Label>) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useFormContext();

  const selected = watch(name);

  useEffect(() => {
    if (
      (selected === undefined || selected === "") &&
      defaultValue !== undefined
    ) {
      setValue(name, defaultValue, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [selected, defaultValue, name, setValue]);

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="d-flex gap-4">
        {data.map((option) => (
          <div className="form-check" key={String(option.value)}>
            <input
              className={`form-check-input ${errors[name] ? "is-invalid" : ""}`}
              type="radio"
              id={`${name}-${String(option.value)}`}
              value={String(option.value)}
              checked={String(selected) === String(option.value)}
              {...register(name, {
                required: required ? `${label || name} is required` : false,
                onChange: (e) => {
                  const value = e.target.value as unknown as Value;
                  onChange?.(value, option);
                },
              })}
              {...rest}
            />
            <label
              className="form-check-label"
              htmlFor={`${name}-${String(option.value)}`}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {errors[name] && isSubmitted && (
        <div className="invalid-feedback d-block">
          {errors[name]?.message as string}
        </div>
      )}
    </div>
  );
};

export { RadioInput };
