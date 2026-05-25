import { useTranslation } from "react-i18next";
import SelectInput from "@components/form/select/SelectInput";
import { TextAreaInput } from "@components/form/inputs/TextAreaInput";
import { CONDITION_OPTIONS } from "@modules/checkout/types/Model";

interface FormFieldsProps {
  readOnly?: boolean;
  assets?: { id: string; name: string; asset_code: string }[];
  users?: { id: string; name: string }[];
}

export const FormFields = ({
  readOnly = false,
  assets,
  users,
}: FormFieldsProps) => {
  const { t } = useTranslation();

  const assetOptions =
    assets?.map((a) => ({
      value: a.id,
      label: `${a.name} (${a.asset_code})`,
    })) ?? [];
  const userOptions =
    users?.map((u) => ({ value: u.id, label: u.name })) ?? [];
  const conditionOptions = CONDITION_OPTIONS.map((c) => ({
    value: c.value,
    label: c.label,
  }));

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
          <SelectInput
            name="expected_return_date"
            label={t("modules.checkout.create.form.expected_return")}
            options={conditionOptions}
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

export const CheckoutFormFields = (props: FormFieldsProps) => (
  <FormFields {...props} />
);

// CheckinFormFields — return_date is NOT shown (BE auto-sets it on check-in)
export const CheckinFormFields = ({ readOnly = false }: { readOnly?: boolean }) => {
  const { t } = useTranslation();
  const conditionOptions = CONDITION_OPTIONS.map((c) => ({
    value: c.value,
    label: c.label,
  }));

  return (
    <>
      <div className="row">
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
            label={t("modules.checkout.update.label_notes")}
            readOnly={readOnly}
          />
        </div>
      </div>
    </>
  );
};
