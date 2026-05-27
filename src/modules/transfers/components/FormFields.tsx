import { useTranslation } from "react-i18next";
import SelectInput from "@components/form/select/SelectInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";

interface FormFieldsProps {
  readOnly?: boolean;
  assets: { id: string; name: string; asset_code: string }[];
  locations: { id: string; name: string }[];
  users: { id: number; first_name: string; last_name: string }[];
}

export const FormFields = ({ readOnly = false, assets, locations, users }: FormFieldsProps) => {
  const { t } = useTranslation();

  const assetOptions = assets.map((a) => ({ value: a.id, label: `${a.name} (${a.asset_code})` }));
  const locationOptions = locations.map((l) => ({ value: l.id, label: l.name }));
  const userOptions = [{ value: "", label: "-- No Custodian --" }, ...users.map((u) => ({ value: String(u.id), label: `${u.first_name} ${u.last_name}`.trim() }))];

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <SelectInput
            name="asset_id"
            label={t("modules.transfers.create.form.asset")}
            options={assetOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="from_location_id"
            label={t("modules.transfers.create.form.from_location")}
            options={locationOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="to_location_id"
            label={t("modules.transfers.create.form.to_location")}
            options={locationOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="from_custodian_id"
            label={t("modules.transfers.create.form.from_custodian")}
            options={userOptions}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="to_custodian_id"
            label={t("modules.transfers.create.form.to_custodian")}
            options={userOptions}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12">
          <TextAreaInput
            name="reason"
            label={t("modules.transfers.create.form.reason")}
            readOnly={readOnly}
            required={true}
          />
        </div>
      </div>
    </>
  );
};