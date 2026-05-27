import { useTranslation } from "react-i18next";
import SelectInput from "@components/form/select/SelectInput";
import { DateInput } from "@components/form/inputs/DateInput";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { MAINTENANCE_TYPES } from "@modules/maintenance/types/Model";

interface FormFieldsProps {
  readOnly?: boolean;
  assets: { id: string; name: string; asset_code: string }[];
  users: { id: string; first_name: string; last_name: string }[];
}

export const FormFields = ({ readOnly = false, assets, users }: FormFieldsProps) => {
  const { t } = useTranslation();

  const assetOptions = assets.map((a) => ({ value: String(a.id), label: `${a.name} (${a.asset_code})` }));
  const typeOptions = MAINTENANCE_TYPES.map((t) => ({ value: t.value, label: t.label }));
  const performedByOptions = users.map((u) => ({ value: String(u.id), label: `${u.first_name} ${u.last_name}`.trim() }));

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <SelectInput
            name="asset_id"
            label={t("modules.maintenance.create.form.asset")}
            options={assetOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="type"
            label={t("modules.maintenance.create.form.type")}
            options={typeOptions}
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
          <SelectInput
            name="performed_by"
            label={t("modules.maintenance.create.form.performed_by")}
            options={performedByOptions}
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