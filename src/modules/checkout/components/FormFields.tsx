import { useTranslation } from "react-i18next";
import SelectInput from "@components/form/select/SelectInput";
import { DateInput } from "@components/form/inputs/DateInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { CONDITION_OPTIONS } from "@modules/checkout/types/Model";

interface FormFieldsProps {
  readOnly?: boolean;
  assets: { id: string; name: string; asset_code: string }[];
  users: { id: string; name: string }[];
}

export const FormFields = ({ readOnly = false, assets, users }: FormFieldsProps) => {
  const { t } = useTranslation();

  const assetOptions = assets.map((a) => ({ value: a.id, label: `${a.name} (${a.asset_code})` }));
  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));
  const conditionOptions = CONDITION_OPTIONS.map((c) => ({ value: c.value, label: c.label }));

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <SelectInput
            name="asset_id"
            label={t("modules.checkout.create.form.asset")}
            options={assetOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="assigned_to"
            label={t("modules.checkout.create.form.assignee")}
            options={userOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <DateInput
            name="expected_return_date"
            label={t("modules.checkout.create.form.expected_return")}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="condition_on_return"
            label={t("modules.checkout.create.form.condition")}
            options={conditionOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <TextAreaInput
            name="notes"
            label={t("modules.checkout.create.form.notes")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};

export const CheckoutFormFields = ({ readOnly = false, assets, users }: FormFieldsProps) => (
  <FormFields readOnly={readOnly} assets={assets} users={users} />
);

export const CheckinFormFields = ({ readOnly = false, assets, users }: FormFieldsProps) => {
  const { t } = useTranslation();
  const conditionOptions = CONDITION_OPTIONS.map((c) => ({ value: c.value, label: c.label }));
  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));

  return (
    <>
      <div className="row">
        <div className="col-12 col-md-6">
          <DateInput
            name="return_date"
            label={t("modules.checkout.create.form.return_date")}
            readOnly={readOnly}
          />
        </div>
        <div className="col-12 col-md-6">
          <SelectInput
            name="condition_on_return"
            label={t("modules.checkout.create.form.condition")}
            options={conditionOptions}
            readOnly={readOnly}
            required={true}
          />
        </div>
        <div className="col-12">
          <TextAreaInput
            name="notes"
            label={t("modules.checkout.create.form.notes")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};