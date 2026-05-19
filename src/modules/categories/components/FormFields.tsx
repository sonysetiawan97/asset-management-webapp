import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import SelectInput from "@components/form/select/SelectInput";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { type Model } from "@modules/categories/types/Model";

interface FormFieldsProps {
  readOnly?: boolean;
  categories: Model[];
  defaultValue?: Model;
}

export const FormFields = ({ readOnly = false, categories, defaultValue }: FormFieldsProps) => {
  const { t } = useTranslation();
  const { setValue, control } = useFormContext();
  const watchedParentId = useWatch({ control, name: "parent_id" });

  // Filter out current category from parent options to prevent circular reference
  const parentOptions = categories
    .filter((cat) => cat.id !== defaultValue?.id)
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));

  // Set defaults from parent when parent_id changes
  useEffect(() => {
    if (watchedParentId) {
      const parent = categories.find((cat) => cat.id === watchedParentId);
      if (parent) {
        setValue("useful_life_years", parent.useful_life_years, { shouldValidate: true });
        setValue("salvage_value_pct", parent.salvage_value_pct, { shouldValidate: true });
      }
    }
  }, [watchedParentId, categories, setValue]);

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <Text
            name="name"
            label={t("modules.categories.create.form.name")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="parent_id"
            label={t("modules.categories.create.form.parent")}
            options={[{ value: "", label: "-- No Parent --" }, ...parentOptions]}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <NumberInput
            name="useful_life_years"
            label={t("modules.categories.create.form.useful_life_years")}
            readOnly={readOnly}
            required={true}
            min={0}
            step={1}
          />
        </div>
        <div className="col-12 col-md-6">
          <NumberInput
            name="salvage_value_pct"
            label={t("modules.categories.create.form.salvage_value_pct")}
            readOnly={readOnly}
            required={true}
            min={0}
            max={100}
            step={0.5}
          />
        </div>
      </div>
    </>
  );
};