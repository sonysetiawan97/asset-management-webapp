import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import SelectReferenceInput from "@components/form/select/SelectReferenceInput";
import { DateInput } from "@components/form/inputs/DateInput";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { MAINTENANCE_TYPES } from "@modules/maintenance/types/Model";
import { useAssetOptions } from "@modules/maintenance/hooks/useAssetOptions";
import { useUserOptions } from "@modules/maintenance/hooks/useUserOptions";

interface FormFieldsProps {
  readOnly?: boolean;
  control: ReturnType<typeof useFormContext>["control"];
}

export const FormFields = ({ readOnly = false, control }: FormFieldsProps) => {
  const { t } = useTranslation();
  const loadAssetOptions = useAssetOptions();
  const loadUserOptions = useUserOptions();

  const typeOptions = MAINTENANCE_TYPES.map((mt) => ({ value: mt.value, label: mt.label }));

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <SelectReferenceInput
            name="asset_id"
            control={control}
            loadOptions={loadAssetOptions}
            label={t("modules.maintenance.create.form.asset")}
            placeholder={t("modules.maintenance.create.form.asset_placeholder")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectReferenceInput
            name="type"
            control={control}
            loadOptions={async () => ({ options: typeOptions, hasMore: false })}
            label={t("modules.maintenance.create.form.type")}
            placeholder={t("modules.maintenance.create.form.type_placeholder")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <DateInput
            name="date_performed"
            label={t("modules.maintenance.create.form.date_performed")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectReferenceInput
            name="performed_by"
            control={control}
            loadOptions={loadUserOptions}
            label={t("modules.maintenance.create.form.performed_by")}
            placeholder={t("modules.maintenance.create.form.performed_by_placeholder")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12">
          <TextAreaInput
            name="description"
            label={t("modules.maintenance.create.form.description")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <NumberInput
            name="cost"
            label={t("modules.maintenance.create.form.cost")}
            readOnly={readOnly}
            min={0}
            step={1}
          />
        </div>
        <div className="col-12 col-md-6">
          <DateInput
            name="next_maintenance_date"
            label={t("modules.maintenance.create.form.next_maintenance")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};
