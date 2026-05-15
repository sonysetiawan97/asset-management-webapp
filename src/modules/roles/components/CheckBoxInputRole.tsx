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
  defaultValue?: Value[];
  required?: boolean;
  onChange?: (
    selectedKeys: Value[],
    selectedItems?: ListOption<Value, Label>[]
  ) => void;
  disabled?: boolean;
}

const CheckBoxInputRole = <Value, Label extends React.ReactNode = React.ReactNode>({
  name,
  label,
  data,
  onChange,
  defaultValue = [],
  required = false,
  disabled = false,
  ...rest
}: Props<Value, Label>) => {
  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const selected: Value[] = watch(name) || [];

  useEffect(() => {
    if ((!selected || selected.length === 0) && defaultValue.length > 0) {
      setValue(name, defaultValue, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, name, setValue]);

  const handleChange = (key: Value, checked: boolean) => {
    const updated: Value[] = checked
      ? [...selected, key]
      : selected.filter((k) => k !== key);

    setValue(name, updated, { shouldValidate: true });

    onChange?.(
      updated,
      data.filter((item) => updated.includes(item.value))
    );
  };

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {data.map((option, index) => {
        const isChecked = selected.includes(option.value);
        return (
          <div className="form-check" key={`${name}-${index}`}>
            <input
              className={`form-check-input ${errors[name] ? "is-invalid" : ""}`}
              type="checkbox"
              id={`${name}-${String(option.value)}`}
              checked={isChecked}
              disabled={disabled}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              {...rest}
            />
            <label
              className="form-check-label"
              htmlFor={`${name}-${String(option.value)}`}
            >
              {option.label}
            </label>
          </div>
        );
      })}
      {errors[name] && (
        <div className="invalid-feedback">
          {errors[name]?.message as string}
        </div>
      )}
    </div>
  );
};

export { CheckBoxInputRole };
