import { useTranslation } from "react-i18next";
import { Text } from "@components/form/inputs/Text";
import SelectInput from "@components/form/select/SelectInput";
import { RadioInput } from "@components/form/inputs/RadioInput";
import { type Model, LOCATION_TYPES, LOCATION_TYPE_ORDER } from "@modules/locations/types/Model";

interface FormFieldsProps {
  readOnly?: boolean;
  locations: Model[];
  defaultValue?: Model;
}

export const FormFields = ({ readOnly = false, locations, defaultValue }: FormFieldsProps) => {
  const { t } = useTranslation();

  // Filter parent options based on selected type
  // Parent must be of type one level above current type
  const currentType = defaultValue?.type;
  const allowedParentTypes = currentType
    ? (Object.keys(LOCATION_TYPE_ORDER) as Array<keyof typeof LOCATION_TYPE_ORDER>).filter(
        (type) => LOCATION_TYPE_ORDER[type] < LOCATION_TYPE_ORDER[currentType],
      )
    : ["site"]; // When creating, default parent type is site

  const parentOptions = locations
    .filter(
      (loc) =>
        loc.id !== defaultValue?.id && // Exclude current location
        allowedParentTypes.includes(loc.type), // Only allow valid parent types
    )
    .map((loc) => ({
      value: loc.id,
      label: `${loc.name} (${loc.type})`,
    }));

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <Text
            name="name"
            label={t("modules.locations.create.form.name")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <Text
            name="code"
            label={t("modules.locations.create.form.code")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12">
          <RadioInput
            name="type"
            label={t("modules.locations.create.form.type")}
            data={LOCATION_TYPES}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="parent_id"
            label={t("modules.locations.create.form.parent")}
            options={[{ value: "", label: "-- No Parent (Root) --" }, ...parentOptions]}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};