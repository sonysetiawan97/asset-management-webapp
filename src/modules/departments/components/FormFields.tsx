import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import SelectInput from "@components/form/select/SelectInput";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { type Model } from "../types/Model";

interface FormFieldsProps {
  readOnly?: boolean;
  departments: Model[];
  defaultValue?: Model;
}

export const FormFields = ({ readOnly = false, departments, defaultValue }: FormFieldsProps) => {
  const { t } = useTranslation();

  // Filter out current department from parent options to prevent circular reference
  const parentOptions = departments
    .filter((dep) => dep.id !== defaultValue?.id)
    .map((dep) => ({
      value: dep.id,
      label: dep.name,
    }));

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <Text
            name="name"
            label={t("modules.departments.form.name")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <Text
            name="code"
            label={t("modules.departments.form.code")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="parent_id"
            label={t("modules.departments.form.parent")}
            options={[{ value: "", label: "-- No Parent --" }, ...parentOptions]}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <NumberInput
            name="budget"
            label={t("modules.departments.form.budget")}
            readOnly={readOnly}
            min={0}
            step={1}
          />
        </div>
        <div className="col-12 col-md-6">
          <NumberInput
            name="headcount"
            label={t("modules.departments.form.headcount")}
            readOnly={readOnly}
            min={0}
            step={1}
          />
        </div>
        <div className="col-12">
          <TextAreaInput
            name="description"
            label={t("modules.departments.form.description")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};