import { useTranslation } from "react-i18next";
import SelectInput from "@components/form/select/SelectInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { NumberInput } from "@components/form/inputs/NumberInput";
import { DateInput } from "@components/form/inputs/DateInput";
import { TextInput } from "@components/form/inputs/TextInput";
import { DISPOSAL_METHODS } from "@modules/disposals/types/Model";

interface FormFieldsProps {
  readOnly?: boolean;
  assets: { id: string; name: string; asset_code: string }[];
}

export const FormFields = ({ readOnly = false, assets }: FormFieldsProps) => {
  const { t } = useTranslation();
  const assetOptions = assets.map((a) => ({ value: a.id, label: `${a.name} (${a.asset_code})` }));
  const methodOptions = DISPOSAL_METHODS.map((m) => ({ value: m.value, label: m.label }));

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <SelectInput
            name="asset_id"
            label={t("modules.disposals.create.form.asset")}
            options={assetOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="method"
            label={t("modules.disposals.create.form.method")}
            options={methodOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <TextAreaInput
            name="reason"
            label={t("modules.disposals.create.form.reason")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <NumberInput
            name="sale_price"
            label={t("modules.disposals.create.form.sale_price")}
            readOnly={readOnly}
            min={0}
            step={1}
          />
        </div>
        <div className="col-12 col-md-6">
          <TextInput
            name="buyer"
            label={t("modules.disposals.create.form.buyer")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <DateInput
            name="transaction_date"
            label={t("modules.disposals.create.form.transaction_date")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <TextInput
            name="certificate_ref"
            label={t("modules.disposals.create.form.certificate_ref")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};