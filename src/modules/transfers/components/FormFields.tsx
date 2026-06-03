import { useTranslation } from "react-i18next";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import SelectInput from "@components/form/select/SelectInput";
import { Text } from "@components/form/inputs/Text";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { TRANSFER_TYPES } from "@modules/transfers/types/Model";

export interface TransferAsset {
  id: string;
  name: string;
  asset_code: string;
  location_id?: string | null;
  location_name?: string;
  custodian_id?: string | null;
  custodian_first_name?: string;
  custodian_last_name?: string;
  department_id?: string | null;
  department_name?: string;
}

interface FormFieldsProps {
  readOnly?: boolean;
  assets: TransferAsset[];
  locations: { id: string; name: string }[];
  departments: { id: string; name: string }[];
  users: { id: number; first_name: string; last_name: string }[];
}

const formatUserName = (u?: { first_name?: string; last_name?: string } | null): string => {
  if (!u) return "—";
  return `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "—";
};

export const FormFields = ({ readOnly = false, assets, locations, departments, users }: FormFieldsProps) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();

  const watchedAssetId = useWatch({ name: "asset_id" });
  const watchedTransferType = useWatch({ name: "transfer_type" });
  const watchedFromLocation = useWatch({ name: "from_location_id" });
  const watchedFromCustodian = useWatch({ name: "from_custodian_id" });
  const watchedFromDepartment = useWatch({ name: "from_department_id" });

  const selectedAsset = assets.find((a) => a.id === watchedAssetId);

  // Auto-populate from-* fields from the selected asset
  useEffect(() => {
    if (selectedAsset) {
      setValue("from_location_id", selectedAsset.location_id ?? "", { shouldValidate: true });
      setValue("from_custodian_id", selectedAsset.custodian_id ?? "", { shouldValidate: false });
      setValue("from_department_id", selectedAsset.department_id ?? "", { shouldValidate: true });
    }
  }, [selectedAsset, setValue]);

  // Reset to_department_id when switching to a type that doesn't need it
  useEffect(() => {
    if (watchedTransferType === "inter_location") {
      setValue("to_department_id", null, { shouldValidate: false });
    }
    if (watchedTransferType === "inter_department") {
      setValue("to_location_id", null, { shouldValidate: false });
    }
  }, [watchedTransferType, setValue]);

  const assetOptions = assets.map((a) => ({ value: a.id, label: `${a.name} (${a.asset_code})` }));
  const locationOptions = locations.map((l) => ({ value: l.id, label: l.name }));
  const departmentOptions = departments.map((d) => ({ value: d.id, label: d.name }));
  const typeOptions = TRANSFER_TYPES.map((tt) => ({ value: tt.value, label: t(`modules.transfers.create.form.transfer_type_options.${tt.value}`) }));
  const userOptions = [{ value: "", label: "-- No Custodian --" }, ...users.map((u) => ({ value: String(u.id), label: `${u.first_name} ${u.last_name}`.trim() }))];

  const fromLocationName = selectedAsset?.location_name
    ?? locations.find((l) => l.id === watchedFromLocation)?.name
    ?? "—";
  const fromCustodianName = selectedAsset
    ? formatUserName({
        first_name: selectedAsset.custodian_first_name,
        last_name: selectedAsset.custodian_last_name,
      })
    : watchedFromCustodian
    ? formatUserName(users.find((u) => String(u.id) === watchedFromCustodian))
    : "—";
  const fromDepartmentName = selectedAsset?.department_name
    ?? departments.find((d) => d.id === watchedFromDepartment)?.name
    ?? "—";

  const showToDepartment = watchedTransferType === "inter_department" || watchedTransferType === "combined";
  const showToLocation = watchedTransferType === "inter_location" || watchedTransferType === "combined";

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
            name="transfer_type"
            label={t("modules.transfers.create.form.transfer_type")}
            options={typeOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h6 className="form-section__title mt-2">{t("modules.transfers.create.form.section.from")}</h6>
        </div>
        <div className="col-12 col-md-4">
          <Text
            name="from_location_id"
            label={t("modules.transfers.create.form.from_location")}
            value={fromLocationName}
            readOnly={true}
          />
        </div>
        <div className="col-12 col-md-4">
          <Text
            name="from_department_id"
            label={t("modules.transfers.create.form.from_department")}
            value={fromDepartmentName}
            readOnly={true}
          />
        </div>
        <div className="col-12 col-md-4">
          <Text
            name="from_custodian_id"
            label={t("modules.transfers.create.form.from_custodian")}
            value={fromCustodianName}
            readOnly={true}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h6 className="form-section__title mt-3">{t("modules.transfers.create.form.section.to")}</h6>
        </div>
        {showToDepartment && (
          <div className="col-12 col-md-6">
            <SelectInput
              name="to_department_id"
              label={t("modules.transfers.create.form.to_department")}
              options={departmentOptions}
              readOnly={readOnly}
              required={true}
            />
          </div>
        )}
        {showToLocation && (
          <div className="col-12 col-md-6">
            <SelectInput
              name="to_location_id"
              label={t("modules.transfers.create.form.to_location")}
              options={locationOptions}
              readOnly={readOnly}
              required={true}
            />
          </div>
        )}
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
