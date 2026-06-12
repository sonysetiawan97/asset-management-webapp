import { useTranslation } from "react-i18next";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import SelectReferenceInput from "@components/form/select/SelectReferenceInput";
import { Text } from "@components/form/inputs/Text";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { TRANSFER_TYPES } from "@modules/transfers/types/Model";
import { useAssetTransferOptions } from "@modules/transfers/hooks/useAssetTransferOptions";
import { useDepartmentOptions } from "@modules/transfers/hooks/useDepartmentOptions";
import { useLocationOptions } from "@modules/transfers/hooks/useLocationOptions";
import { useUserOptions } from "@modules/transfers/hooks/useUserOptions";
import { useFindOneById } from "@hooks/request/useFindOneById";
import type { SelectOption } from "@/types/SelectOption";

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
  control: any;
}

const formatUserName = (u?: { first_name?: string; last_name?: string } | null): string => {
  if (!u) return "—";
  return `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || "—";
};

export const FormFields = ({ readOnly = false, control }: FormFieldsProps) => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();

  const watchedAssetId = useWatch({ name: "asset_id" }) as string | undefined;
  const watchedTransferType = useWatch({ name: "transfer_type" });
  const watchedFromLocation = useWatch({ name: "from_location_id" }) as string | undefined;
  const watchedFromDepartment = useWatch({ name: "from_department_id" }) as string | undefined;

  const { data: assetDetails } = useFindOneById<TransferAsset>("assets", watchedAssetId);

  const loadAssetOptions = useAssetTransferOptions();
  const loadDepartmentOptions = useDepartmentOptions();
  const loadLocationOptions = useLocationOptions();
  const loadUserOptions = useUserOptions();

  // Auto-populate from-* fields when asset is selected
  useEffect(() => {
    if (assetDetails) {
      setValue("from_location_id", assetDetails.location_id ?? "", { shouldValidate: true });
      setValue("from_custodian_id", assetDetails.custodian_id ?? "", { shouldValidate: false });
      setValue("from_department_id", assetDetails.department_id ?? "", { shouldValidate: true });
    }
  }, [assetDetails, setValue]);

  // Reset to_department_id when switching to a type that doesn't need it
  useEffect(() => {
    if (watchedTransferType === "inter_location") {
      setValue("to_department_id", null, { shouldValidate: false });
    }
    if (watchedTransferType === "inter_department") {
      setValue("to_location_id", null, { shouldValidate: false });
    }
  }, [watchedTransferType, setValue]);

  const typeOptions = TRANSFER_TYPES.map((tt) => ({ value: tt.value, label: t(`modules.transfers.create.form.transfer_type_options.${tt.value}`) }));

  const fromLocationName = assetDetails?.location_name ?? "—";
  const fromCustodianName = assetDetails
    ? formatUserName({
        first_name: assetDetails.custodian_first_name,
        last_name: assetDetails.custodian_last_name,
      })
    : "—";
  const fromDepartmentName = assetDetails?.department_name ?? "—";

  const showToDepartment = watchedTransferType === "inter_department" || watchedTransferType === "combined";
  const showToLocation = watchedTransferType === "inter_location" || watchedTransferType === "combined";

  const isDepartmentDisabled = (option: SelectOption) => {
    return watchedFromDepartment != null && String(option.value) === String(watchedFromDepartment);
  };

  const isLocationDisabled = (option: SelectOption) => {
    return watchedFromLocation != null && String(option.value) === String(watchedFromLocation);
  };

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <SelectReferenceInput
            name="asset_id"
            control={control}
            loadOptions={loadAssetOptions}
            label={t("modules.transfers.create.form.asset")}
            placeholder={t("modules.transfers.create.form.asset_placeholder")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectReferenceInput
            name="transfer_type"
            control={control}
            loadOptions={async () => ({ options: typeOptions, hasMore: false })}
            label={t("modules.transfers.create.form.transfer_type")}
            placeholder={t("modules.transfers.create.form.transfer_type_placeholder")}
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
            <SelectReferenceInput
              name="to_department_id"
              control={control}
              loadOptions={loadDepartmentOptions}
              label={t("modules.transfers.create.form.to_department")}
              placeholder={t("modules.transfers.create.form.to_department_placeholder")}
              readOnly={readOnly}
              required={true}
              isOptionDisabled={isDepartmentDisabled}
            />
          </div>
        )}
        {showToLocation && (
          <div className="col-12 col-md-6">
            <SelectReferenceInput
              name="to_location_id"
              control={control}
              loadOptions={loadLocationOptions}
              label={t("modules.transfers.create.form.to_location")}
              placeholder={t("modules.transfers.create.form.to_location_placeholder")}
              readOnly={readOnly}
              required={true}
              isOptionDisabled={isLocationDisabled}
            />
          </div>
        )}
        <div className="col-12 col-md-6">
          <SelectReferenceInput
            name="to_custodian_id"
            control={control}
            loadOptions={loadUserOptions}
            label={t("modules.transfers.create.form.to_custodian")}
            placeholder={t("modules.transfers.create.form.to_custodian_placeholder")}
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
